const crypto = require("crypto");

const SYSTEM_PROMPT = [
  "Voce e Deadpool, assistente pessoal do Victor: sarcastico de forma leve, direto, leal, util e respeitoso.",
  "Conduza cada atendimento com acolhimento breve, proximo passo objetivo e encerramento claro.",
  "Nunca narre raciocinio, processamento, chamadas de ferramenta ou bastidores tecnicos.",
  "Nunca invente resultados de ferramentas.",
  "Use ferramentas somente quando elas forem necessarias ao pedido.",
  "Acoes de escrita dependem da confirmacao tratada pelo aplicativo.",
  "Responda em portugues brasileiro, salvo se o usuario pedir outro idioma.",
].join(" ");

function sanitizeHistory(history, limit = 20) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((message) => message?.role === "user" || message?.role === "assistant")
    .slice(-limit)
    .map((message) => ({ role: message.role, content: String(message.content || "").slice(0, 20_000) }));
}

function providerLabel(executor, reviewer) {
  const labels = { openai: "OpenAI", claude: "Claude" };
  return reviewer ? `${labels[executor]} + ${labels[reviewer]}` : labels[executor] || executor;
}

class AgentOrchestrator {
  constructor({ router, toolRegistry, maxSteps = 6, pendingTtlMs = 10 * 60_000 }) {
    this.router = router;
    this.toolRegistry = toolRegistry;
    this.maxSteps = maxSteps;
    this.pendingTtlMs = pendingTtlMs;
    this.pending = new Map();
  }

  getStatus() {
    return this.router.getStatus();
  }

  async run({ message, history = [], mode = "auto" }) {
    this.pruneExpiredPending();
    const normalizedMessage = String(message || "").trim();
    if (!normalizedMessage) return this.failure("Digite uma mensagem antes de enviar.", history);
    if (normalizedMessage.length > 12_000) return this.failure("Mensagem excede 12000 caracteres.", history);

    const visibleHistory = sanitizeHistory(history);
    visibleHistory.push({ role: "user", content: normalizedMessage });

    try {
      const execution = await this.router.start({
        mode,
        system: SYSTEM_PROMPT,
        history: visibleHistory,
        tools: this.toolRegistry.definitions,
      });

      return await this.advance({
        mode,
        userMessage: normalizedMessage,
        visibleHistory,
        ...execution,
        steps: 1,
        toolEvidence: [],
      });
    } catch (error) {
      return this.failure(this.publicError(error), visibleHistory);
    }
  }

  async resume({ confirmationId, approved }) {
    const pending = this.pending.get(String(confirmationId || ""));
    this.pending.delete(String(confirmationId || ""));

    if (!pending) return this.failure("Esta confirmacao expirou ou ja foi utilizada.", []);
    if (Date.now() > pending.expiresAt) return this.failure("Esta confirmacao expirou. Envie o pedido novamente.", pending.visibleHistory);

    const events = [];
    try {
      const results = await this.executeToolCalls(pending.toolCalls, Boolean(approved), events);
      pending.toolEvidence.push(...results.map((result) => ({ tool: result.name, output: result.output })));
      pending.provider.appendToolResults(pending.session, results);
      pending.response = await pending.provider.respond(pending.session, {
        system: SYSTEM_PROMPT,
        tools: this.toolRegistry.definitions,
      });
      pending.steps += 1;
      return await this.advance(pending, events);
    } catch (error) {
      return this.failure(this.publicError(error), pending.visibleHistory, events);
    }
  }

  async advance(state, events = []) {
    while (state.steps <= this.maxSteps) {
      const toolCalls = state.response.toolCalls || [];
      if (toolCalls.length) {
        const confirmationCalls = toolCalls.filter((call) => this.toolRegistry.get(call.name)?.requiresConfirmation);
        if (confirmationCalls.length) {
          const confirmationId = crypto.randomUUID();
          const summaries = confirmationCalls.map((call) => {
            const tool = this.toolRegistry.get(call.name);
            return tool.summarize(call.args || {});
          });

          this.pending.set(confirmationId, {
            ...state,
            toolCalls,
            expiresAt: Date.now() + this.pendingTtlMs,
          });

          return {
            finalText: null,
            history: state.visibleHistory,
            confirmation: {
              id: confirmationId,
              message: `Deadpool quer ${summaries.join(" e ")}. Deseja permitir?`,
            },
            events: [...events, { status: "waiting", tools: confirmationCalls.map((call) => call.name) }],
            provider: providerLabel(state.providerName),
          };
        }

        const results = await this.executeToolCalls(toolCalls, true, events);
        state.toolEvidence.push(...results.map((result) => ({ tool: result.name, output: result.output })));
        state.provider.appendToolResults(state.session, results);
        state.response = await state.provider.respond(state.session, {
          system: SYSTEM_PROMPT,
          tools: this.toolRegistry.definitions,
        });
        state.steps += 1;
        continue;
      }

      const draft = String(state.response.text || "").trim();
      if (!draft) throw new Error("O modelo nao devolveu uma resposta final.");

      let finalText = draft;
      let reviewerName = null;
      let reviewWarning = null;
      if (state.mode === "dual-review") {
        const review = await this.router.review({
          executorName: state.providerName,
          system: SYSTEM_PROMPT,
          userMessage: state.userMessage,
          draft,
          toolEvidence: state.toolEvidence,
        });
        finalText = review.text;
        reviewerName = review.reviewerName;
        reviewWarning = review.warning;
      }

      const finalHistory = [...state.visibleHistory, { role: "assistant", content: finalText }];
      const warning = reviewWarning || (state.fallbackErrors?.length ? state.fallbackErrors.join(" | ") : null);
      return {
        finalText,
        history: finalHistory,
        confirmation: null,
        events,
        provider: providerLabel(state.providerName, reviewerName),
        warning: warning ? this.publicError(warning) : null,
      };
    }

    throw new Error("Limite de etapas atingido antes da resposta final.");
  }

  async executeToolCalls(toolCalls, approved, events) {
    const results = [];

    for (const call of toolCalls) {
      const tool = this.toolRegistry.get(call.name);
      if (!tool) {
        results.push({ id: call.id, name: call.name, output: { ok: false, error: "Ferramenta desconhecida" }, isError: true });
        events.push({ status: "error", tool: call.name, error: "Ferramenta desconhecida" });
        continue;
      }

      if (tool.requiresConfirmation && !approved) {
        results.push({ id: call.id, name: call.name, output: { ok: false, canceled: true, message: "Acao recusada pelo usuario" }, isError: true });
        events.push({ status: "canceled", tool: call.name });
        continue;
      }

      events.push({ status: "running", tool: call.name });
      try {
        const output = await this.toolRegistry.execute(call.name, call.args || {});
        results.push({ id: call.id, name: call.name, output, isError: false });
        events.push({ status: "success", tool: call.name, result: output });
      } catch (error) {
        const message = this.publicError(error);
        results.push({ id: call.id, name: call.name, output: { ok: false, error: message }, isError: true });
        events.push({ status: "error", tool: call.name, error: message });
      }
    }

    return results;
  }

  publicError(error) {
    const message = String(error?.message || error || "Erro desconhecido");
    return message.replace(/sk-[A-Za-z0-9_-]+/g, "[credencial protegida]").slice(0, 500);
  }

  pruneExpiredPending() {
    const now = Date.now();
    for (const [id, pending] of this.pending.entries()) {
      if (now > pending.expiresAt) this.pending.delete(id);
    }
  }

  failure(error, history, events = []) {
    return {
      finalText: "Nao consegui concluir essa solicitacao. Verifique a configuracao e tente novamente.",
      history: sanitizeHistory(history),
      confirmation: null,
      events,
      provider: null,
      error,
    };
  }
}

module.exports = { AgentOrchestrator, SYSTEM_PROMPT };

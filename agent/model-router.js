const VALID_MODES = new Set(["auto", "openai", "claude", "dual-review"]);

class ModelRouter {
  constructor({ providers, primaryProvider = "openai" }) {
    this.providers = providers;
    if (!providers[primaryProvider]) {
      throw new Error(`Provedor principal nao registrado: ${primaryProvider}`);
    }
    this.primaryProvider = primaryProvider;
  }

  getStatus() {
    const providerStatus = Object.fromEntries(
      Object.entries(this.providers).map(([name, provider]) => [
        name,
        { configured: provider.isAvailable(), model: provider.model },
      ]),
    );

    return {
      primaryProvider: this.primaryProvider,
      providers: providerStatus,
      modes: [...VALID_MODES],
    };
  }

  getExecutionOrder(mode) {
    if (!VALID_MODES.has(mode)) {
      throw new Error(`Modo de modelo invalido: ${mode}`);
    }

    if (mode === "openai" || mode === "claude") return [mode];
    const secondary = this.primaryProvider === "openai" ? "claude" : "openai";
    return [this.primaryProvider, secondary];
  }

  async start({ mode, system, history, tools }) {
    const order = this.getExecutionOrder(mode);
    const errors = [];

    for (const providerName of order) {
      const provider = this.providers[providerName];
      if (!provider?.isAvailable()) {
        errors.push(`${providerName}: chave nao configurada`);
        continue;
      }

      const session = provider.createSession(history);
      try {
        const response = await provider.respond(session, { system, tools });
        return { providerName, provider, session, response, fallbackErrors: errors };
      } catch (error) {
        errors.push(`${providerName}: ${error.message}`);
        if (mode === "openai" || mode === "claude") throw error;
      }
    }

    throw new Error(`Nenhum provedor disponivel. ${errors.join(" | ")}`);
  }

  async review({ executorName, system, userMessage, draft, toolEvidence = [] }) {
    const reviewerName = executorName === "openai" ? "claude" : "openai";
    const reviewer = this.providers[reviewerName];

    if (!reviewer?.isAvailable()) {
      return { text: draft, reviewerName: null, warning: `${reviewerName} nao esta configurado` };
    }

    const reviewSystem = [
      system,
      "Voce e o revisor final desta resposta.",
      "Corrija erros factuais, lacunas e instrucoes inseguras.",
      "Preserve o tom util e direto do personagem.",
      "Nao mencione revisao, modelos, bastidores ou processo interno.",
      "Nao solicite nem execute ferramentas. Retorne somente a resposta final ao usuario.",
      "Resultados de ferramentas fornecidos no pedido sao fatos autoritativos: preserve valores, nomes e identificadores.",
    ].join(" ");

    const session = reviewer.createSession([
      {
        role: "user",
        content: [
          `Pedido original:\n${userMessage}`,
          `Resultados autoritativos das ferramentas:\n${JSON.stringify(toolEvidence).slice(0, 8000)}`,
          `Resposta candidata:\n${draft}`,
        ].join("\n\n"),
      },
    ]);

    try {
      const response = await reviewer.respond(session, { system: reviewSystem, tools: [] });
      if (!response.text) {
        return { text: draft, reviewerName: null, warning: `${reviewerName} nao devolveu texto` };
      }
      return { text: response.text, reviewerName, warning: null };
    } catch (error) {
      return { text: draft, reviewerName: null, warning: `${reviewerName}: ${error.message}` };
    }
  }
}

module.exports = { ModelRouter, VALID_MODES };

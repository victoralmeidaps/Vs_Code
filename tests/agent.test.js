const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { OpenAIProvider } = require("../agent/providers/openai-provider");
const { ClaudeProvider } = require("../agent/providers/claude-provider");
const { readAgentConfig } = require("../agent/config");
const { ModelRouter } = require("../agent/model-router");
const { AgentOrchestrator } = require("../agent/orchestrator");

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("OpenAI normaliza function_call e devolve function_call_output", async () => {
  const requests = [];
  const fetchImpl = async (_url, options) => {
    requests.push(JSON.parse(options.body));
    if (requests.length === 1) {
      return jsonResponse({
        id: "resp_1",
        output: [{ type: "function_call", call_id: "call_1", name: "get_weather", arguments: '{"city":"Recife"}' }],
      });
    }
    return jsonResponse({
      id: "resp_2",
      output_text: "Recife esta com 28 C.",
      output: [{ type: "message", role: "assistant", content: [{ type: "output_text", text: "Recife esta com 28 C." }] }],
    });
  };

  const provider = new OpenAIProvider({ apiKey: "test", model: "gpt-test", fetchImpl });
  const session = provider.createSession([{ role: "user", content: "Clima em Recife" }]);
  const first = await provider.respond(session, {
    system: "teste",
    tools: [{ name: "get_weather", description: "clima", inputSchema: { type: "object", properties: {}, additionalProperties: false } }],
  });

  assert.deepEqual(first.toolCalls, [{ id: "call_1", name: "get_weather", args: { city: "Recife" } }]);
  provider.appendToolResults(session, [{ id: "call_1", output: { ok: true, temperatureC: 28 } }]);
  const second = await provider.respond(session, { system: "teste", tools: [] });

  assert.equal(second.text, "Recife esta com 28 C.");
  assert.equal(requests[1].input.at(-1).type, "function_call_output");
  assert.equal(requests[1].input.at(-1).call_id, "call_1");
});

test("Claude normaliza tool_use e envia tool_result imediatamente depois", async () => {
  const requests = [];
  const fetchImpl = async (_url, options) => {
    requests.push(JSON.parse(options.body));
    if (requests.length === 1) {
      return jsonResponse({
        id: "msg_1",
        stop_reason: "tool_use",
        content: [{ type: "tool_use", id: "toolu_1", name: "list_notes", input: { limit: 5 } }],
      });
    }
    return jsonResponse({
      id: "msg_2",
      stop_reason: "end_turn",
      content: [{ type: "text", text: "Voce tem duas notas." }],
    });
  };

  const provider = new ClaudeProvider({ apiKey: "test", model: "claude-test", fetchImpl });
  const session = provider.createSession([{ role: "user", content: "Liste notas" }]);
  const first = await provider.respond(session, {
    system: "teste",
    tools: [{ name: "list_notes", description: "notas", inputSchema: { type: "object", properties: {}, additionalProperties: false } }],
  });

  assert.deepEqual(first.toolCalls, [{ id: "toolu_1", name: "list_notes", args: { limit: 5 } }]);
  provider.appendToolResults(session, [{ id: "toolu_1", output: { ok: true, notes: [] }, isError: false }]);
  const second = await provider.respond(session, { system: "teste", tools: [] });

  assert.equal(second.text, "Voce tem duas notas.");
  const toolResultMessage = requests[1].messages.at(-1);
  assert.equal(toolResultMessage.role, "user");
  assert.equal(toolResultMessage.content[0].type, "tool_result");
  assert.equal(toolResultMessage.content[0].tool_use_id, "toolu_1");
});

class FakeProvider {
  constructor(name, responder, available = true) {
    this.name = name;
    this.model = `${name}-test`;
    this.responder = responder;
    this.available = available;
  }

  isAvailable() {
    return this.available;
  }

  createSession(history) {
    return { history, turn: 0, toolResults: [] };
  }

  async respond(session, options) {
    const response = await this.responder(session, options);
    session.turn += 1;
    return response;
  }

  appendToolResults(session, results) {
    session.toolResults.push(...results);
  }
}

test("modo automatico usa fallback quando o provedor principal falha", async () => {
  const openai = new FakeProvider("openai", async () => {
    throw new Error("indisponivel");
  });
  const claude = new FakeProvider("claude", async () => ({ text: "Fallback concluido.", toolCalls: [] }));
  const router = new ModelRouter({ providers: { openai, claude }, primaryProvider: "openai" });

  const result = await router.start({ mode: "auto", system: "teste", history: [], tools: [] });
  assert.equal(result.providerName, "claude");
  assert.match(result.fallbackErrors[0], /openai/);
});

test("roteador rejeita provedor principal inexistente", () => {
  assert.throws(
    () => new ModelRouter({ providers: {}, primaryProvider: "inexistente" }),
    /Provedor principal nao registrado/,
  );
});

test("configuracao rejeita provedor e limite de tokens invalidos", () => {
  const root = path.resolve(__dirname, "..");
  const previousProvider = process.env.DEADPOOL_PRIMARY_PROVIDER;
  const previousMaxTokens = process.env.ANTHROPIC_MAX_TOKENS;
  const previousReasoningEffort = process.env.OPENAI_REASONING_EFFORT;

  try {
    process.env.DEADPOOL_PRIMARY_PROVIDER = "inexistente";
    assert.throws(() => readAgentConfig(root), /DEADPOOL_PRIMARY_PROVIDER invalido/);

    process.env.DEADPOOL_PRIMARY_PROVIDER = "openai";
    process.env.ANTHROPIC_MAX_TOKENS = "zero";
    assert.throws(() => readAgentConfig(root), /ANTHROPIC_MAX_TOKENS/);

    process.env.ANTHROPIC_MAX_TOKENS = "2048";
    process.env.OPENAI_REASONING_EFFORT = "impossivel";
    assert.throws(() => readAgentConfig(root), /OPENAI_REASONING_EFFORT/);
  } finally {
    if (previousProvider === undefined) delete process.env.DEADPOOL_PRIMARY_PROVIDER;
    else process.env.DEADPOOL_PRIMARY_PROVIDER = previousProvider;
    if (previousMaxTokens === undefined) delete process.env.ANTHROPIC_MAX_TOKENS;
    else process.env.ANTHROPIC_MAX_TOKENS = previousMaxTokens;
    if (previousReasoningEffort === undefined) delete process.env.OPENAI_REASONING_EFFORT;
    else process.env.OPENAI_REASONING_EFFORT = previousReasoningEffort;
  }
});

test("dupla revisao executa cada ferramenta uma unica vez", async () => {
  let executions = 0;
  const openai = new FakeProvider("openai", async (session) => {
    if (session.turn === 0) {
      return { text: "", toolCalls: [{ id: "call_weather", name: "get_weather", args: { city: "Santos" } }] };
    }
    return { text: "Rascunho com clima.", toolCalls: [] };
  });
  const claude = new FakeProvider("claude", async (session, options) => {
    assert.deepEqual(options.tools, []);
    assert.match(session.history[0].content, /"temperatureC":24/);
    return { text: "Resposta revisada com clima.", toolCalls: [] };
  });
  const router = new ModelRouter({ providers: { openai, claude }, primaryProvider: "openai" });
  const tool = {
    name: "get_weather",
    description: "clima",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    requiresConfirmation: false,
    summarize: () => "consultar clima",
  };
  const toolRegistry = {
    definitions: [tool],
    get: (name) => (name === tool.name ? tool : null),
    execute: async () => {
      executions += 1;
      return { ok: true, temperatureC: 24 };
    },
  };
  const orchestrator = new AgentOrchestrator({ router, toolRegistry });

  const result = await orchestrator.run({ message: "Clima em Santos", mode: "dual-review" });
  assert.equal(executions, 1);
  assert.equal(result.finalText, "Resposta revisada com clima.");
  assert.equal(result.provider, "OpenAI + Claude");
});

test("ferramenta de escrita exige confirmacao de uso unico", async () => {
  let executions = 0;
  const openai = new FakeProvider("openai", async (session) => {
    if (session.turn === 0) {
      return { text: "", toolCalls: [{ id: "call_note", name: "save_note", args: { text: "Comprar racao" } }] };
    }
    return { text: "Nota salva.", toolCalls: [] };
  });
  const claude = new FakeProvider("claude", async () => ({ text: "", toolCalls: [] }), false);
  const router = new ModelRouter({ providers: { openai, claude }, primaryProvider: "openai" });
  const tool = {
    name: "save_note",
    description: "nota",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    requiresConfirmation: true,
    summarize: ({ text }) => `salvar a nota "${text}"`,
  };
  const toolRegistry = {
    definitions: [tool],
    get: (name) => (name === tool.name ? tool : null),
    execute: async () => {
      executions += 1;
      return { ok: true };
    },
  };
  const orchestrator = new AgentOrchestrator({ router, toolRegistry });

  const pending = await orchestrator.run({ message: "Anote comprar racao", mode: "auto" });
  assert.equal(executions, 0);
  assert.ok(pending.confirmation?.id);

  const completed = await orchestrator.resume({ confirmationId: pending.confirmation.id, approved: true });
  assert.equal(executions, 1);
  assert.equal(completed.finalText, "Nota salva.");

  const replay = await orchestrator.resume({ confirmationId: pending.confirmation.id, approved: true });
  assert.equal(executions, 1);
  assert.match(replay.error, /expirou|utilizada/);
});

test("renderer possui entrada real e nao contem credenciais", () => {
  const root = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "avatar-widget.html"), "utf8");
  const rendererAgent = fs.readFileSync(path.join(root, "deadpool-agent.js"), "utf8");

  assert.match(html, /id="messageInput"/);
  assert.doesNotMatch(html, /Mensagem enviada pelo balão de diálogo/);
  assert.doesNotMatch(`${html}\n${rendererAgent}`, /OPENAI_API_KEY|ANTHROPIC_API_KEY/);
});

test("preview legado usa asset existente e nao expoe auto-narracao ou HTML inseguro", () => {
  const root = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "deadpool-chat.html"), "utf8");

  assert.doesNotMatch(html, /jarva-source\.png/);
  assert.doesNotMatch(html, /\.innerHTML\s*=/);
  assert.doesNotMatch(
    html,
    /Estou anotando|Estou processando|Vou executar uma ferramenta|ajustando o contexto|acompanhando o fluxo sem precisar/i,
  );
});

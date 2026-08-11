const { postJson } = require("../http");

function cloneHistory(history) {
  return history
    .filter((message) => message?.role === "user" || message?.role === "assistant")
    .map((message) => ({ role: message.role, content: String(message.content || "") }));
}

class ClaudeProvider {
  constructor({ apiKey, model, maxTokens = 2048, fetchImpl = globalThis.fetch }) {
    this.name = "claude";
    this.apiKey = apiKey;
    this.model = model;
    this.maxTokens = maxTokens;
    this.fetchImpl = fetchImpl;
  }

  isAvailable() {
    return Boolean(this.apiKey);
  }

  createSession(history) {
    return { messages: cloneHistory(history) };
  }

  async respond(session, { system, tools = [] }) {
    const body = {
      model: this.model,
      max_tokens: this.maxTokens,
      system,
      messages: session.messages,
    };

    if (tools.length) {
      body.tools = tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
        strict: true,
      }));
      body.tool_choice = { type: "auto" };
    }

    const payload = await postJson("https://api.anthropic.com/v1/messages", {
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body,
      fetchImpl: this.fetchImpl,
    });

    if (!Array.isArray(payload.content)) {
      throw new Error("Resposta invalida do Claude: campo content ausente.");
    }
    if (payload.stop_reason === "max_tokens") {
      throw new Error("Claude atingiu o limite de tokens antes de concluir.");
    }

    session.messages.push({ role: "assistant", content: payload.content });

    const text = payload.content
      .filter((block) => block.type === "text" && typeof block.text === "string")
      .map((block) => block.text)
      .join("\n")
      .trim();

    const toolCalls = payload.content
      .filter((block) => block.type === "tool_use")
      .map((block) => ({ id: block.id, name: block.name, args: block.input || {} }));

    return { text, toolCalls, responseId: payload.id || null };
  }

  appendToolResults(session, results) {
    session.messages.push({
      role: "user",
      content: results.map((result) => ({
        type: "tool_result",
        tool_use_id: result.id,
        content: JSON.stringify(result.output),
        is_error: result.isError || undefined,
      })),
    });
  }
}

module.exports = { ClaudeProvider };

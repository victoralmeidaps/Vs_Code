const { postJson } = require("../http");

function cloneHistory(history) {
  return history
    .filter((message) => message?.role === "user" || message?.role === "assistant")
    .map((message) => ({ role: message.role, content: String(message.content || "") }));
}

function extractText(payload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  return (payload.output || [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content || [])
    .filter((content) => content.type === "output_text" && typeof content.text === "string")
    .map((content) => content.text)
    .join("\n")
    .trim();
}

class OpenAIProvider {
  constructor({ apiKey, model, reasoningEffort = "low", fetchImpl = globalThis.fetch }) {
    this.name = "openai";
    this.apiKey = apiKey;
    this.model = model;
    this.reasoningEffort = reasoningEffort;
    this.fetchImpl = fetchImpl;
  }

  isAvailable() {
    return Boolean(this.apiKey);
  }

  createSession(history) {
    return { input: cloneHistory(history) };
  }

  async respond(session, { system, tools = [] }) {
    const body = {
      model: this.model,
      instructions: system,
      input: session.input,
      tool_choice: tools.length ? "auto" : "none",
      reasoning: { effort: this.reasoningEffort },
    };

    if (tools.length) {
      body.tools = tools.map((tool) => ({
        type: "function",
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
        strict: true,
      }));
    }

    const payload = await postJson("https://api.openai.com/v1/responses", {
      headers: { authorization: `Bearer ${this.apiKey}` },
      body,
      fetchImpl: this.fetchImpl,
    });

    if (!Array.isArray(payload.output)) {
      throw new Error("Resposta invalida da OpenAI: campo output ausente.");
    }

    session.input.push(...payload.output);

    const toolCalls = payload.output
      .filter((item) => item.type === "function_call")
      .map((item) => ({
        id: item.call_id,
        name: item.name,
        args: JSON.parse(item.arguments || "{}"),
      }));

    return {
      text: extractText(payload),
      toolCalls,
      responseId: payload.id || null,
    };
  }

  appendToolResults(session, results) {
    for (const result of results) {
      session.input.push({
        type: "function_call_output",
        call_id: result.id,
        output: JSON.stringify(result.output),
      });
    }
  }
}

module.exports = { OpenAIProvider };

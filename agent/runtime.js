const path = require("path");
const { readAgentConfig } = require("./config");
const { ModelRouter } = require("./model-router");
const { AgentOrchestrator } = require("./orchestrator");
const { OpenAIProvider } = require("./providers/openai-provider");
const { ClaudeProvider } = require("./providers/claude-provider");
const { createToolRegistry } = require("./tools");

function createAgentRuntime({ rootDir = path.resolve(__dirname, ".."), dataDir, fetchImpl = globalThis.fetch } = {}) {
  if (!dataDir) throw new Error("dataDir e obrigatorio para iniciar o agente.");
  const config = readAgentConfig(rootDir);

  const providers = {
    openai: new OpenAIProvider({ ...config.openai, fetchImpl }),
    claude: new ClaudeProvider({ ...config.claude, fetchImpl }),
  };
  const router = new ModelRouter({ providers, primaryProvider: config.primaryProvider });
  const toolRegistry = createToolRegistry({ dataDir, fetchImpl });
  return new AgentOrchestrator({ router, toolRegistry });
}

module.exports = { createAgentRuntime };

const fs = require("fs");
const path = require("path");

const VALID_PRIMARY_PROVIDERS = new Set(["openai", "claude"]);
const VALID_OPENAI_REASONING_EFFORTS = new Set(["none", "low", "medium", "high", "xhigh", "max"]);

function loadLocalEnv(rootDir) {
  const envPath = path.join(rootDir, ".env");
  if (!fs.existsSync(envPath)) return;

  if (typeof process.loadEnvFile === "function") {
    process.loadEnvFile(envPath);
  }
}

function readAgentConfig(rootDir) {
  loadLocalEnv(rootDir);

  const primaryProvider = String(process.env.DEADPOOL_PRIMARY_PROVIDER || "openai")
    .trim()
    .toLowerCase();
  if (!VALID_PRIMARY_PROVIDERS.has(primaryProvider)) {
    throw new Error(
      `DEADPOOL_PRIMARY_PROVIDER invalido: ${primaryProvider}. Use openai ou claude.`,
    );
  }

  const claudeMaxTokens = Number(process.env.ANTHROPIC_MAX_TOKENS || 2048);
  if (!Number.isInteger(claudeMaxTokens) || claudeMaxTokens < 1) {
    throw new Error("ANTHROPIC_MAX_TOKENS deve ser um numero inteiro maior que zero.");
  }

  const openaiReasoningEffort = String(process.env.OPENAI_REASONING_EFFORT || "low")
    .trim()
    .toLowerCase();
  if (!VALID_OPENAI_REASONING_EFFORTS.has(openaiReasoningEffort)) {
    throw new Error(
      "OPENAI_REASONING_EFFORT invalido. Use none, low, medium, high, xhigh ou max.",
    );
  }

  return {
    primaryProvider,
    openai: {
      apiKey: process.env.OPENAI_API_KEY || "",
      model: process.env.OPENAI_MODEL || "gpt-5.6-terra",
      reasoningEffort: openaiReasoningEffort,
    },
    claude: {
      apiKey: process.env.ANTHROPIC_API_KEY || "",
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
      maxTokens: claudeMaxTokens,
    },
  };
}

module.exports = {
  readAgentConfig,
  VALID_PRIMARY_PROVIDERS,
  VALID_OPENAI_REASONING_EFFORTS,
};

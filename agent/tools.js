const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

function requireString(value, field, maxLength) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Parametro invalido: ${field}`);
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new Error(`${field} excede ${maxLength} caracteres`);
  }
  return normalized;
}

async function fetchJson(url, fetchImpl, timeoutMs = 10_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (error?.name === "AbortError") throw new Error("Tempo limite excedido");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function readNotes(notesPath) {
  try {
    const data = JSON.parse(await fs.readFile(notesPath, "utf8"));
    if (!Array.isArray(data)) throw new Error("Formato invalido");
    return data;
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw new Error(`Nao foi possivel ler as notas: ${error.message}`);
  }
}

async function writeNotes(notesPath, notes) {
  await fs.mkdir(path.dirname(notesPath), { recursive: true });
  const temporaryPath = `${notesPath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(notes, null, 2)}\n`, { mode: 0o600 });
  await fs.rename(temporaryPath, notesPath);
}

function createToolRegistry({ dataDir, fetchImpl = globalThis.fetch }) {
  const notesPath = path.join(dataDir, "notes.json");

  const tools = [
    {
      name: "get_weather",
      description: "Consulta o clima atual de uma cidade usando o Open-Meteo. Use somente quando o usuario pedir clima, temperatura, sensacao termica ou vento de uma localidade. A ferramenta resolve o nome da cidade antes de consultar a previsao atual. Ela nao altera dados e nao exige confirmacao.",
      inputSchema: {
        type: "object",
        properties: {
          city: { type: "string", description: "Nome da cidade, com estado ou pais quando necessario." },
        },
        required: ["city"],
        additionalProperties: false,
      },
      requiresConfirmation: false,
      summarize: ({ city }) => `consultar o clima de ${String(city || "uma cidade")}`,
      handler: async ({ city }) => {
        const normalizedCity = requireString(city, "city", 120);
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(normalizedCity)}&count=1&language=pt&format=json`;
        const geoData = await fetchJson(geoUrl, fetchImpl);
        const place = geoData?.results?.[0];
        if (!place) return { ok: false, city: normalizedCity, message: "Cidade nao encontrada" };

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m`;
        const weatherData = await fetchJson(weatherUrl, fetchImpl);
        return {
          ok: true,
          city: place.name,
          region: place.admin1 || null,
          country: place.country,
          temperatureC: weatherData?.current?.temperature_2m,
          feelsLikeC: weatherData?.current?.apparent_temperature,
          windKmh: weatherData?.current?.wind_speed_10m,
          weatherCode: weatherData?.current?.weather_code,
        };
      },
    },
    {
      name: "save_note",
      description: "Salva uma nota curta no armazenamento privado do aplicativo. Use quando o usuario pedir explicitamente para anotar, registrar ou guardar uma informacao. Esta ferramenta altera dados locais, portanto sempre exige confirmacao antes da execucao. Ela retorna um identificador estavel da nota salva.",
      inputSchema: {
        type: "object",
        properties: {
          text: { type: "string", description: "Conteudo exato que deve ser salvo na nota." },
        },
        required: ["text"],
        additionalProperties: false,
      },
      requiresConfirmation: true,
      summarize: ({ text }) => {
        const preview = String(text || "").replace(/\s+/g, " ").slice(0, 90);
        return `salvar a nota "${preview}${String(text || "").length > 90 ? "..." : ""}"`;
      },
      handler: async ({ text }) => {
        const normalizedText = requireString(text, "text", 4000);
        const notes = await readNotes(notesPath);
        const note = {
          id: crypto.randomUUID(),
          text: normalizedText,
          createdAt: new Date().toISOString(),
        };
        notes.push(note);
        await writeNotes(notesPath, notes.slice(-1000));
        return { ok: true, note };
      },
    },
    {
      name: "list_notes",
      description: "Lista as notas locais mais recentes salvas pelo assistente. Use quando o usuario pedir para ver, consultar ou relembrar notas que ja foram registradas. A ferramenta e somente leitura e nao exige confirmacao. O limite deve ficar entre 1 e 50 notas.",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1, maximum: 50, description: "Quantidade maxima de notas recentes." },
        },
        required: ["limit"],
        additionalProperties: false,
      },
      requiresConfirmation: false,
      summarize: ({ limit }) => `consultar as ${Number(limit) || 10} notas mais recentes`,
      handler: async ({ limit }) => {
        const normalizedLimit = Number(limit);
        if (!Number.isInteger(normalizedLimit) || normalizedLimit < 1 || normalizedLimit > 50) {
          throw new Error("Parametro invalido: limit");
        }
        const notes = await readNotes(notesPath);
        return { ok: true, notes: notes.slice(-normalizedLimit).reverse(), total: notes.length };
      },
    },
  ];

  const byName = new Map(tools.map((tool) => [tool.name, tool]));

  return {
    definitions: tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
    get(name) {
      return byName.get(name) || null;
    },
    async execute(name, args) {
      const tool = byName.get(name);
      if (!tool) throw new Error(`Ferramenta desconhecida: ${name}`);
      return tool.handler(args || {});
    },
  };
}

module.exports = { createToolRegistry };

class HttpError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

async function postJson(url, { headers, body, fetchImpl = globalThis.fetch, timeoutMs = 60_000 }) {
  if (typeof fetchImpl !== "function") {
    throw new HttpError("Fetch indisponivel neste ambiente.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = payload?.error?.message || payload?.message || `HTTP ${response.status}`;
      throw new HttpError(detail, response.status);
    }

    return payload;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new HttpError("Tempo limite excedido ao consultar o modelo.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { HttpError, postJson };

// Fachada do renderer. O raciocinio, as credenciais e as ferramentas ficam no processo principal.

function getDesktopApi() {
  if (!window.deadpoolDesktop) {
    throw new Error("Backend seguro indisponivel. Abra o assistente pelo aplicativo Electron.");
  }
  return window.deadpoolDesktop;
}

function emitToolEvents(events, hooks) {
  if (!hooks?.onToolEvent || !Array.isArray(events)) return;
  for (const event of events) hooks.onToolEvent(event);
}

async function runAgent(userMessage, history = [], hooks = {}, options = {}) {
  const api = getDesktopApi();
  let result = await api.runAgent({
    message: userMessage,
    history,
    mode: options.mode || "auto",
  });
  emitToolEvents(result.events, hooks);

  while (result.confirmation) {
    const confirmed = hooks.askConfirmation
      ? await hooks.askConfirmation(result.confirmation.message)
      : window.confirm(result.confirmation.message);

    result = await api.resumeAgent({
      confirmationId: result.confirmation.id,
      approved: Boolean(confirmed),
    });
    emitToolEvents(result.events, hooks);
  }

  return result;
}

async function getStatus() {
  return getDesktopApi().getStatus();
}

window.DeadpoolAgent = Object.freeze({ runAgent, getStatus });

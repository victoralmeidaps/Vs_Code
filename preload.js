const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("deadpoolDesktop", {
  runAgent(payload) {
    return ipcRenderer.invoke("deadpool:run", payload);
  },
  resumeAgent(payload) {
    return ipcRenderer.invoke("deadpool:resume", payload);
  },
  getStatus() {
    return ipcRenderer.invoke("deadpool:status");
  },
  closeApp() {
    ipcRenderer.send("deadpool:close");
  },
});

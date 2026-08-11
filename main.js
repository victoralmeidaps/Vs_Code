const path = require("path");
const { app, BrowserWindow, ipcMain, screen, session } = require("electron");
const { createAgentRuntime } = require("./agent/runtime");

let avatarWindow;
let agentRuntime;
const hasLock = app.requestSingleInstanceLock();

if (!hasLock) {
  app.quit();
}

function createAvatarWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  const width = 470;
  const height = 650;

  avatarWindow = new BrowserWindow({
    width,
    height,
    x: workArea.x + workArea.width - width - 24,
    y: workArea.y + workArea.height - height - 24,
    frame: false,
    transparent: true,
    resizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app.isPackaged,
    },
  });

  avatarWindow.setAlwaysOnTop(true, "screen-saver");
  avatarWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  avatarWindow.setMenuBarVisibility(false);
  avatarWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  avatarWindow.loadFile(path.join(__dirname, "avatar-widget.html"));
}

function registerAgentIpc() {
  ipcMain.handle("deadpool:run", (_event, payload) => agentRuntime.run(payload || {}));
  ipcMain.handle("deadpool:resume", (_event, payload) => agentRuntime.resume(payload || {}));
  ipcMain.handle("deadpool:status", () => agentRuntime.getStatus());
  ipcMain.on("deadpool:close", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });
}

app.whenReady().then(() => {
  if (!hasLock) return;
  if (process.platform === "darwin") app.dock.hide();
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  agentRuntime = createAgentRuntime({
    rootDir: __dirname,
    dataDir: path.join(app.getPath("userData"), "deadpool-agent"),
  });
  registerAgentIpc();
  createAvatarWindow();
});

app.on("second-instance", () => {
  if (!avatarWindow) return;
  if (avatarWindow.isMinimized()) avatarWindow.restore();
  avatarWindow.show();
  avatarWindow.focus();
});

app.on("window-all-closed", () => {
  app.quit();
});

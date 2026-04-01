import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { exec } from "child_process";
import path from "node:path";
createRequire(import.meta.url);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    title: "Lazy Person Startup Apps",
    icon: path.join(process.env.APP_ROOT, "buttonImage", "startup.png"),
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#0a0a2e",
      symbolColor: "#ffffff",
      height: 36
    },
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.on("lunch-mode", (_event, mode) => {
  if (mode == "Coding") {
    exec("explorer.exe spotify:");
    exec('cmd /c start "" "C:\\Users\\Asus\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"');
    exec("cmd /c start steam://rungameid/3548580");
    exec('start chrome --profile-directory="Profile 1" https://claude.ai');
  }
  if (mode == "Game") {
    exec("explorer.exe spotify:");
    exec("start discord://");
    exec('start chrome --profile-directory="Profile 3" https://www.bilibili.com/');
    exec('cmd /c start "" "C:\\Users\\Asus\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Steam\\Steam.lnk"');
  }
  if (mode == "Study") {
    exec('start chrome --profile-directory="Profile 3" https://mytimes.taylors.edu.my/login/index.php');
  }
});
Menu.setApplicationMenu(null);
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};

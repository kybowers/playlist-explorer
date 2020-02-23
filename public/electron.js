const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1280, height: 720, webPreferences: { nodeIntegration: true } });
  mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.removeMenu();
  }
  mainWindow.on("closed", () => (mainWindow = null));
}

function createAuthWindow(requestEvent, arg) {
  const options = {
    login_domain: "https://accounts.spotify.com/authorize",
    client_id: "a8ff7a9a03ef4c4fad295f9c4344f408",
    redirect_uri: "http://localhost:3000/app"
  };
  const loginHostname = new URL(options.login_domain).hostname;
  const authWindow = new BrowserWindow({
    width: 450,
    height: 900,
    show: false,
    parent: mainWindow,
    modal: true,
  });
  const spotifyAuthURL =
    `${options.login_domain}?client_id=${options.client_id}&redirect_uri=${options.redirect_uri}&response_type=token&display=popup`;
  authWindow.loadURL(spotifyAuthURL);
  authWindow.webContents.on("did-finish-load", function() {
    authWindow.show();
  });
  authWindow.webContents.on("will-redirect", function(event, url) {
    const newUrlObject = new URL(url)
    if (newUrlObject.hostname !== loginHostname) {
      const raw_code = /access_token=([^&]*)/.exec(url) || null;
      const access_token = raw_code && raw_code.length > 1 ? raw_code[1] : null;
  
      if (access_token) {
        requestEvent.reply("access-granted", access_token);
      }
      authWindow.close();
    }
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("spotify-authenticate", createAuthWindow);

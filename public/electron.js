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
  }
  mainWindow.on("closed", () => (mainWindow = null));
}

function createAuthWindow(requestEvent, arg) {
  const options = {
    client_id: "dea2db6618114b038ae3fd02284a8bde",
    redirect_uri: "http://localhost:3000/app"
  };
  const authWindow = new BrowserWindow({
    width: 450,
    height: 900,
    show: false,
    parent: mainWindow,
    modal: true,
    webPreferences: { nodeIntegration: true }
  });
  const spotifyAuthURL =
    "https://accounts.spotify.com/authorize?client_id=" +
    options.client_id +
    "&redirect_uri=" +
    options.redirect_uri +
    "&response_type=token&display=popup";
  authWindow.loadURL(spotifyAuthURL);
  authWindow.webContents.on("did-finish-load", function() {
    authWindow.show();
  });
  authWindow.webContents.on("will-redirect", function(event, oldUrl, newUrl) {
    const raw_code = /access_token=([^&]*)/.exec(oldUrl) || null;
    const access_token = raw_code && raw_code.length > 1 ? raw_code[1] : null;

    if (access_token) {
      requestEvent.reply("access-granted", access_token);
    }
    authWindow.close();
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

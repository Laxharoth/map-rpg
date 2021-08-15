const { app , BrowserWindow } = require("electron");

let window;

function createWindow(){
    window = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Angular and Electron",
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadURL(`file://${__dirname}/dist/angular-electron/index.html`);
    window.on("closed", ()=>{
        window=null;
    })
    window.webContents.on("did-fail-load", ()=>{
        window.loadURL(`file://${__dirname}/dist/angular-electron/index.html`);
    })
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
});
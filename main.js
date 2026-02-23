const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const path = require('path');

const appServe = app.isPackaged ? serve({
    directory: path.join(__dirname, 'out')
}) : null;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    if (app.isPackaged) {
        appServe(win).then(() => {
            win.loadURL('app://-');
        });
    } else {
        win.loadURL('http://localhost:3000');
        // win.webContents.openDevTools();
    }
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

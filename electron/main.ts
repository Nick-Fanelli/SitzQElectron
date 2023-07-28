import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

import { Notification } from 'electron'

//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let mainWindow: BrowserWindow | null

function createWindow() {
    // Where the window is created
    mainWindow = new BrowserWindow({
        icon: path.join(process.env.PUBLIC, 'sitzq.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        focusable: true,
        title: "SitzQ",
        titleBarStyle: "hidden",
    })

    mainWindow.setSize(1024, 800);

    // Test active push message to Renderer-process.
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    mainWindow.loadFile(path.join(process.env.DIST, 'index.html'));
}

app.on('window-all-closed', () => {
    mainWindow = null
})

ipcMain.on('notify', async() => {
    
    console.log("Hello World");

    new Notification({
        title: "Something Cool",
        body: "Another thing that's cool"
    }).show();

})

app.whenReady().then(createWindow)

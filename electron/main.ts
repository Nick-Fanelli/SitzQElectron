import { app, BrowserWindow, Menu } from 'electron'
import path from 'node:path'
import { bindAllIPCs } from './api/api'
import getMenuTemplate from './menubar'

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
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

const createWindow = () => {
    // Where the window is created
    mainWindow = new BrowserWindow({
        icon: path.join(process.env.PUBLIC, 'Application.icns'),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
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

    bindAllIPCs();
    setDefaultProtocolClient();

    // MenuBar
    const menu = Menu.buildFromTemplate(getMenuTemplate());
    Menu.setApplicationMenu(menu);

    if (VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(VITE_DEV_SERVER_URL);
    } else {
        // win.loadFile('dist/index.html')
        mainWindow.loadFile(path.join(process.env.DIST, 'index.html'))
    }
}

const setDefaultProtocolClient = () => {

    const customExt = '.sqshow';
    const exePath = process.execPath;
    const fileArg = __filename;

    app.setAsDefaultProtocolClient(customExt, exePath, [fileArg]);
}


app.whenReady().then(() => {
    createWindow();
})

app.on('window-all-closed', () => {
    mainWindow = null
});
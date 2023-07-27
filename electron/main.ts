import { app, BrowserWindow } from 'electron'
import path from 'node:path'

// The built directory structure
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
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

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

    if (VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        mainWindow.loadFile(path.join(process.env.DIST, 'index.html'))
    }
}

app.on('window-all-closed', () => {
    mainWindow = null
})

app.whenReady().then(createWindow)

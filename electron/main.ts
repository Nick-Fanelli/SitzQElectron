import { app, BrowserWindow, Menu } from 'electron'
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


let defaultWindow: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

const createWindow = () => {
    // Where the window is created
    defaultWindow = new BrowserWindow({
        icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        focusable: true,
        title: "SitzQ",
        titleBarStyle: "hidden"
    })

    // Test active push message to Renderer-process.
    defaultWindow.webContents.on('did-finish-load', () => {
        defaultWindow?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        defaultWindow.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        defaultWindow.loadFile(path.join(process.env.DIST, 'index.html'))
    }
}

const createMenu = () => {

    const isMac = process.platform === 'darwin';

    const fileMenu: Electron.MenuItemConstructorOptions = {
        label: 'File',
        submenu: [
            { label: 'New Workspace' },
            { label: 'Open Workspace' },
            { label: 'Save Workspace' },
            { label: 'Save Workspace As...' },
            { label: 'Close Workspace' },
            { label: 'Import Show Control Settings' },
            { label: 'Export Show Control Settings' },
        ],
    };

    const editMenu: Electron.MenuItemConstructorOptions = {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' },
            { label: 'Preferences' },
        ],
    };

    const workspaceMenu: Electron.MenuItemConstructorOptions = {
        label: 'Workspace',
        submenu: [
        ],
    };

    const cueMenu: Electron.MenuItemConstructorOptions = {
        label: 'Cue',
        submenu: [
            { label: 'New Cue' },
            { label: 'Duplicate Cue' },
            { label: 'Delete Cue' },
            { label: 'Cue Inspector' },
            { label: 'Group Cues' },
            { label: 'Ungroup Cues' },
            { label: 'Rename Cue' },
        ],
    };

    const playbackMenu: Electron.MenuItemConstructorOptions = {
        label: 'Playback',
        submenu: [
        ],
    };

    const deviceMenu: Electron.MenuItemConstructorOptions = {
        label: 'Device',
        submenu: [
        ],
    };

    const windowMenu: Electron.MenuItemConstructorOptions = {
        label: 'Window',
        submenu: [
        ],
    };

    const helpMenu: Electron.MenuItemConstructorOptions = {
        label: 'Help',
        role: 'help',
        id: 'help',
        submenu: [
            { label: "Check for Updates" },
            { label: "SitzQ Manual" },
            { type: 'separator' },
            { label: "Report a Bug" }
        ],
    };

    const template: Electron.MenuItemConstructorOptions[] = [
        fileMenu,
        editMenu,
        workspaceMenu,
        cueMenu,
        playbackMenu,
        deviceMenu,
        windowMenu,
        helpMenu,
    ];

    if (isMac) {
        template.unshift({ role: 'appMenu' });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

}

app.whenReady().then(() => {
    createWindow();
    createMenu();
})

app.on('window-all-closed', () => {
    defaultWindow = null;
})


import { app, BrowserWindow, Menu } from 'electron'
import path from 'node:path'
import { bindAllIPCs } from './api/api'

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
    mainWindow = null
});

app.whenReady().then(createWindow);
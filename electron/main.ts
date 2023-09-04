import { app, BrowserWindow, dialog, Menu } from 'electron'
import path from 'node:path'
import { bindAllIPCs } from './api/api'
import getMenuTemplate from './menubar'
import electronIsDev from 'electron-is-dev'
import { setApplicationOpenedFile } from './api/app-api'
import { pathCreator } from './utils'

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let landerWindow: BrowserWindow | null
 
const createWindow = () => {
    // Where the window is created
    landerWindow = new BrowserWindow({
        icon: path.join(process.env.PUBLIC, 'Application.icns'),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        focusable: true,
        title: "SitzQ",
    });

    landerWindow.setSize(1024, 800);

    bindAllIPCs();
    setDefaultProtocolClient();

    // Menu Bar
    const menu = Menu.buildFromTemplate(getMenuTemplate());
    Menu.setApplicationMenu(menu);

    landerWindow.loadURL(pathCreator("LanderView"));

    const handleSaveOnClose = () => {
        landerWindow?.webContents.send('window-closing');
    }

    landerWindow.on('close', (e) => {

        if(electronIsDev) {
            handleSaveOnClose();
        } else {
 
            const choice = dialog.showMessageBoxSync(landerWindow!, {
                type: "question",
                buttons: [ 'Yes', 'No' ],
                title: "Confirm",
                message: "Are you sure you want to close SitzQ?"
            });

            if(choice === 1) {
                e.preventDefault();
            } else {
                handleSaveOnClose();
            }
        }

    });

    landerWindow.on('closed', () => {
        landerWindow = null;
    });
}

const setDefaultProtocolClient = () => {

    const customProtocols: { protocol: string, extension: string }[] = [

        { protocol: 'SitzQ Show File', extension: 'sqshow' }

    ];

    const exePath = process.execPath;
    const fileArg = __filename;

    customProtocols.forEach(({ protocol, extension }) => {

        app.setAsDefaultProtocolClient(protocol, exePath, [ fileArg + '.' + extension ]);

    });
    
}

app.whenReady().then(() => {
    createWindow();
})

app.on('open-file', (event, filepath) => {

    event.preventDefault();

    landerWindow?.webContents.send('file-opened', filepath);
    setApplicationOpenedFile(filepath);

})

app.on('window-all-closed', () => {

    if(process.platform !== 'darwin') {
        app.quit();
    }

});
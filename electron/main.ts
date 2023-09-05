import { app, Menu } from 'electron'
import path from 'node:path'
import { bindAllIPCs } from './api/api'
import getMenuTemplate from './menubar'
import { Launcher } from './launcher'
import { ApplicationCache } from './cache'

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

const launchApplication = () => {

    setDefaultProtocolClient(); // Define to the OS files to identify
    bindAllIPCs(); // Bind all backend apis

    // Load Application Cache
    ApplicationCache.bindCacheIPCs();
    ApplicationCache.loadCache();
    
    // Open Launcher Window
    Launcher.openLauncherWindow();

    // Menu Bar
    const menu = Menu.buildFromTemplate(getMenuTemplate());
    Menu.setApplicationMenu(menu);
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
    launchApplication();
});


// Handle On Application Quit
app.on('before-quit', () => {
    
    ApplicationCache.saveCache();
    
});

// Handle when all windows are closed
app.on('window-all-closed', () => {

    if(process.platform !== 'darwin') {
        app.quit();
    }

})

// TODO: REIMPLEMENT
// app.on('open-file', (event, filepath) => {

//     event.preventDefault();

//     launcherWindow?.webContents.send('file-opened', filepath);
//     setApplicationOpenedFile(filepath);

// });
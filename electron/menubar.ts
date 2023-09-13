import isDev from 'electron-is-dev'
import { BuildSpecs } from '../src/BuildSpecs';

const getMenuTemplate = () => {

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
        ],
    };

    const viewMenu: Electron.MenuItemConstructorOptions = {
        label: 'View',
        submenu: [
            { role: 'zoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { role: 'resetZoom' },
        ],
    };

    const projectMenu: Electron.MenuItemConstructorOptions = {
        label: 'Project',
        submenu: [
            { label: 'Project Settings' }
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
        viewMenu,
        projectMenu,
        cueMenu,
        playbackMenu,
        deviceMenu,
        windowMenu,
        helpMenu,
    ];

    if(isDev) {
        const devMenu: Electron.MenuItemConstructorOptions = {
            label: 'Dev Tools',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
            ]
        }

        template.push(devMenu);
    }

    if (isMac) {
        template.unshift({
            label: 'SitzQ',
            submenu: [
                { role: 'about', label: `About SitzQ v${BuildSpecs.BUILD_VERSION}` },
                { type: 'separator' },
                { label: 'Global Settings' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        });
    }

    return template;

}

export default getMenuTemplate;
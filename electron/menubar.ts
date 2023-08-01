
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

    return template;

}

export default getMenuTemplate;
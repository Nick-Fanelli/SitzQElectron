import { Menu } from 'electron';
import { BuildSpecs } from '../src/BuildSpecs';
import { WindowCommon } from './window-common';
import { appOpenProject } from './api/app-api';
import { Launcher } from './launcher';
import { BrowserWindow } from 'electron';

export namespace MenuBar {

    let launcherMenubar: Menu;
    let appMenubar: Menu;

    export enum MenuBarType { Launcher, App }

    export const createMenubars = () => {

        launcherMenubar = Menu.buildFromTemplate(getLauncherMenuTemplate());
        appMenubar = Menu.buildFromTemplate(getAppMenuTemplate());

    }

    export const changeMenubar = (window: BrowserWindow | null, menuBarType: MenuBarType) => {

        switch(menuBarType) {

            case MenuBarType.Launcher:
                if(window)
                    window.setMenu(launcherMenubar);
                Menu.setApplicationMenu(launcherMenubar);
                break;
            case MenuBarType.App:
                if(window)
                    window.setMenu(appMenubar);
                Menu.setApplicationMenu(appMenubar);
                break;
            default:
                if(window)
                    window.setMenu(null);
                Menu.setApplicationMenu(null);
                break;

        }

    }

    export const getAppMenuTemplate = () => {

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

        if(process.env.NODE_ENV === 'development') {
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

    export const getLauncherMenuTemplate = () => {

        const isMac = process.platform === 'darwin';

        const fileMenu: Electron.MenuItemConstructorOptions = {
            label: 'File',
            submenu: [
                { 
                    label: 'Open Project',
                    accelerator: 'CmdOrCtrl+Shift+O',
                    click: () => {
                        Launcher.openLauncherWindow(); // Make sure launcher window is opened

                        const window = WindowCommon.getActiveWindow();
                        appOpenProject(window);
                    }
                }
            ],
        };

        const viewMenu: Electron.MenuItemConstructorOptions = {
            label: 'View',
            submenu: [
                { label: 'Show Launcher Window', click: () => Launcher.openLauncherWindow() },
                { type: 'separator' },
                { role: 'zoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { role: 'resetZoom' },
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
            viewMenu,
            helpMenu,
        ];

        if(process.env.NODE_ENV === 'development') {
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
}
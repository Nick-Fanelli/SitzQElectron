import path from 'node:path'

import { BrowserWindow } from "electron"
import { ApplicationCache } from './cache';
import { WindowCommon } from './window-common';
import { MenuBar } from './menubar';
import { osType } from './api/machine-api';

export namespace Launcher {

    let launcherWindow: BrowserWindow | null = null;
    let isWindowReady = false;
    let isBehindShow = false;

    export const openLauncherWindow = (shouldDisplay: boolean = true) => {

        // If the launcher is already open just focus it
        if(launcherWindow !== null) {
            launcherWindow.focus();
            return;
        }

        isWindowReady = false;

        // Create launcher window object
        launcherWindow = new BrowserWindow({
            icon: path.join(process.env.PUBLIC, 'Application.icns'),
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js'),
            },
            focusable: true,
            title: "SitzQ Launcher",
            show: false
        });

        MenuBar.changeMenubar(launcherWindow, MenuBar.MenuBarType.Launcher);

        // Set Size
        launcherWindow.setSize(1024, 800);

        // Launch Window
        launcherWindow.loadURL(WindowCommon.getWindowURL('LanderView'));

        // Handle Close
        launcherWindow.on('closed', () => {
            ApplicationCache.saveCache();
            launcherWindow = null
        });

        launcherWindow.on('focus', () => {

            if(osType() == 'MacOS')
                MenuBar.changeMenubar(launcherWindow, MenuBar.MenuBarType.Launcher);

        });

        launcherWindow.once('ready-to-show', () => {
            if(shouldDisplay || isBehindShow)
                launcherWindow?.show();

            isWindowReady = true;
            isBehindShow = false;
        });

    }

    export const showLauncherWindow = () => {

        if(launcherWindow && !launcherWindow.isVisible && isWindowReady) {
            launcherWindow.show();
        } else {
            isBehindShow = true;
        }

    }

    export const sendWebContents = <T> (messageChannel: string, data: T) => {

        launcherWindow?.webContents.send(messageChannel, data);

    }

    export const closeLauncherWindow = () => {

        launcherWindow?.close();

    }

}
import path from 'node:path'

import { BrowserWindow } from "electron"
import { ElectronUtils } from './electron-utils';
import { ApplicationCache } from './cache';

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

        // Set Size
        launcherWindow.setSize(1024, 800);

        // Load URL
        launcherWindow.loadURL(ElectronUtils.pathCreator("LanderView"));

        // Handle Close
        launcherWindow.on('closed', () => {
            ApplicationCache.saveCache();
            launcherWindow = null
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
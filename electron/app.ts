import { BrowserWindow } from "electron";
import { ElectronUtils } from "./electron-utils";

import path from 'node:path'

export namespace App {

    let appWindows: BrowserWindow[] = [];

    export const openAppWindow = (showFilepath: string) => {

        let appWindow: BrowserWindow | null = new BrowserWindow({
            icon: path.join(process.env.PUBLIC, "Application.icns"),
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js')
            },
            focusable: true,
            title: showFilepath,
            titleBarStyle: "hidden",
            titleBarOverlay: true,
            show: false,
        });
    
        appWindow.setSize(1024, 800);
    
        appWindow.loadURL(ElectronUtils.pathCreator("AppView", [ 
            { key: "projectFilepath", value: showFilepath },
        ]));

        appWindows.push(appWindow);
    
        appWindow.on('closed', () => {
            appWindows.filter((window) => window !== appWindow);
            appWindow = null;
        });
    
        appWindow.once('ready-to-show', () => appWindow?.show());

    }

    export const sendWebContents = <T> (messageChannel: string, data: T) => {

        appWindows.forEach((window) => {
            window.webContents.send(messageChannel, data);
        });

    }

}
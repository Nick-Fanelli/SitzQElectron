import { BrowserWindow } from "electron";

import path from 'node:path'
import os from 'os'
import { Launcher } from "./launcher";
import { ApplicationCache } from "./cache";
import { WindowCommon } from "./window-common";
import { MenuBar } from "./menubar";
import { osType } from "./api/machine-api";

export namespace App {

    let appWindows: BrowserWindow[] = [];

    export const openAppWindow = (showFilepath: string) => {

        Launcher.closeLauncherWindow();

        let appWindow: BrowserWindow | null = new BrowserWindow({
            icon: path.join(process.env.PUBLIC, "Application.icns"),
            backgroundColor: "#161616",
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js')
            },
            focusable: true,
            title: showFilepath,
            titleBarStyle: os.type() === "Darwin" ? "hidden" : 'default',
            titleBarOverlay: true,
            show: false,
        });

        MenuBar.changeMenubar(appWindow, MenuBar.MenuBarType.App);

        appWindow.setSize(1024, 800);

        appWindow.loadURL(WindowCommon.getWindowURL('AppView', [
            { key: 'projectFilepath', value: showFilepath }
        ]));
        
        appWindows.push(appWindow);
    
        appWindow.on('closed', () => {
            appWindows = appWindows.filter((window) => window !== appWindow);
            appWindow = null;
            
            ApplicationCache.saveCache();

            if(appWindows.length == 0) {
                MenuBar.changeMenubar(null, MenuBar.MenuBarType.Launcher);
            }
        });

        appWindow.on('focus', () => {

            if(osType() == 'MacOS')
                MenuBar.changeMenubar(appWindow, MenuBar.MenuBarType.App);

        });
    
        appWindow.once('ready-to-show', () => appWindow?.show());

    }

    export const sendWebContents = <T> (messageChannel: string, data: T) => {

        appWindows.forEach((window) => {
            window.webContents.send(messageChannel, data);
        });

    }

}
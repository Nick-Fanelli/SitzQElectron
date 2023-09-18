import { ipcRenderer, ipcMain, BrowserWindow, dialog } from "electron";
import SubAPIContext from "./subapi";
import fs from 'fs';
import { App } from "../app";
import { ApplicationCache } from "../cache";

let applicationOpenedFile: string | null = null;

export const setApplicationOpenedFile = (filepath: string) => { applicationOpenedFile = filepath; }

export interface AppAPI {

    addOnFileOpenedListener: (listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void
    removeOnFileOpenedListener: (listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void

    addOnCacheChangeListener: (listener: (event: Electron.IpcRendererEvent, cache: ApplicationCache.CacheType) => void) => void
    removeOnCacheChangeListener: (listener: (event: Electron.IpcRendererEvent, cache: ApplicationCache.CacheType) => void) => void

    onRequestProjectSave: (listener: (event: Electron.IpcRendererEvent) => void) => (() => void)
    
    requestCachedState: (returnCallback: (event: Electron.IpcRendererEvent, cache: ApplicationCache.CacheType) => void) => void
    setCachePair: (key: string, value: any) => void

    getApplicationOpenedFile: (callback: (filepath: string) => void) => void

    launchProject: (showFilepath: string) => void

    openProject: () => Promise<any>

}

export const appOpenProject = async (activeWindow: BrowserWindow | null) => {

    if(activeWindow == null) {
        console.error("Active window came in as null in appOpenProject");
        return;
    }

    try {

        const result = await dialog.showOpenDialog(activeWindow, {
            properties: ['openFile'],
            filters: [
                { name: "SitzQ Show File", extensions: [ 'sqshow' ] }
            ]
        });

        if(!result.canceled && result.filePaths.length > 0) {

            const selectedFile = result.filePaths[0];
            appLaunchProject(selectedFile);
            
        }

    } catch(error) {
        console.error("Error while opening project: ", error);
    }

}

export const appLaunchProject = (showFilepath: string) => {
    // Validate that the show filepath exists
    if(!fs.existsSync(showFilepath)) {
        console.error("Show filepath does not exist");
        return; // TODO: RETURN AN ERROR
    }

    App.openAppWindow(showFilepath)
}

const onBindIPCs = () => {

    ipcMain.handle('app-open-project', async (e) => appOpenProject(BrowserWindow.fromWebContents(e.sender)));
    ipcMain.handle('app-launch-project', async (_, showFilepath: string) => appLaunchProject(showFilepath));

}


const boundAppAPI: AppAPI = {

    addOnFileOpenedListener: (listener) => ipcRenderer.on('file-opened', listener),
    removeOnFileOpenedListener: (listener) => ipcRenderer.removeListener('file-opened', listener),

    addOnCacheChangeListener: (listener) => ipcRenderer.on('cache-state-changed', listener),
    removeOnCacheChangeListener: (listener) => ipcRenderer.removeListener('cache-state-changed', listener),


    onRequestProjectSave: (listener) => {
        ipcRenderer.on('req-project-save', listener);
        return () => { ipcRenderer.removeListener('req-project-save', listener); }
    },

    getApplicationOpenedFile: (callback: (filepath: string) => void) => { if(applicationOpenedFile !== null) callback(applicationOpenedFile); },

    requestCachedState: (returnCallback) => {
        ipcRenderer.send('request-cached-state');

        ipcRenderer.on('response-cached-state', returnCallback);
    },
    setCachePair: (key, value) => ipcRenderer.invoke("cache-set-pair", key, value),

    launchProject: (showFilepath: string) => ipcRenderer.invoke('app-launch-project', showFilepath),

    openProject: () => ipcRenderer.invoke('app-open-project')

}

const AppSubAPIContext: SubAPIContext<AppAPI> = {

    apiBindings: boundAppAPI,

    onBindIPCs

}

export default AppSubAPIContext;
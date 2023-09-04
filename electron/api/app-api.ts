import { ipcRenderer, ipcMain, BrowserWindow, dialog } from "electron";
import SubAPIContext from "./subapi";
import fs from 'fs';
import { App } from "../app";

let applicationOpenedFile: string | null = null;

export const setApplicationOpenedFile = (filepath: string) => { applicationOpenedFile = filepath; }

export interface AppAPI {

    addOnFileOpenedListener: (listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void
    removeOnFileOpenedListener: (listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void

    getApplicationOpenedFile: (callback: (filepath: string) => void) => void

    launchProject: (showFilepath: string) => void

    openProject: () => Promise<any>

}

const onBindIPCs = () => {

    ipcMain.handle('app-open-project', async (e) => {

        const activeWindow = BrowserWindow.fromWebContents(e.sender)!;

        try {

            const result = await dialog.showOpenDialog(activeWindow, {
                properties: ['openFile'],
                filters: [
                    { name: "SitzQ Show File", extensions: [ 'sqshow' ] }
                ]
            });

            if(!result.canceled && result.filePaths.length > 0) {

                const selectedFile = result.filePaths[0];

                return selectedFile;

            }

        } catch(error) {
            console.error("Error while opening project: ", error);
        }

        return null;

    });

    ipcMain.handle('app-launch-project', async (_, showFilepath: string) => {

        // Validate that the show filepath exists
        if(!fs.existsSync(showFilepath)) {
            console.error("Show filepath does not exist");
            return; // TODO: RETURN AN ERROR
        }

        App.openAppWindow(showFilepath)

    });

}


const boundAppAPI: AppAPI = {

    addOnFileOpenedListener: (listener) => ipcRenderer.addListener('file-opened', listener),
    removeOnFileOpenedListener: (listener) => ipcRenderer.removeListener('file-opened', listener),

    getApplicationOpenedFile: (callback: (filepath: string) => void) => { if(applicationOpenedFile !== null) callback(applicationOpenedFile); },

    launchProject: (showFilepath: string) => ipcRenderer.invoke('app-launch-project', showFilepath),

    openProject: () => ipcRenderer.invoke('app-open-project')

}

const AppSubAPIContext: SubAPIContext<AppAPI> = {

    apiBindings: boundAppAPI,

    onBindIPCs

}

export default AppSubAPIContext;
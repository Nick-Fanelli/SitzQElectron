import { BrowserWindow } from "electron"

export namespace ElectronUtils {

    export const getFocusedWindow = (): BrowserWindow => {

        let focusedWindow = BrowserWindow.getFocusedWindow();

        if(focusedWindow === null) {

            focusedWindow = BrowserWindow.getAllWindows()[0];

        }

        return focusedWindow;
    }

}
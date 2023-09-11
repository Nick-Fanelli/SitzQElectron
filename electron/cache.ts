import { ipcMain } from "electron";
import { Launcher } from "./launcher";
import { readFile, writeFile } from "./api/machine-api";
import { App } from "./app";

import path from 'node:path'
import os from 'node:os'

export namespace ApplicationCache {

    export type CacheType = { [key: string]: any };

    let activeCache: CacheType = {};

    export const getCacheFilepath = () => {

        const cacheFilename = "application-cache.json"; // TODO: FOR PROD OMIT THE .JSON

        switch(process.platform) {

            case 'darwin':
                return path.join(os.homedir(), 'Library', 'Caches', 'SitzQ', 'Cache', cacheFilename);
            case 'win32':
                return path.join(os.homedir(), 'AppData', 'Local', 'SitzQ', 'Cache', cacheFilename);
            default:
                return path.join(os.homedir(), '.SitzQ', 'Cache', cacheFilename);

        }

    } 

    export const bindCacheIPCs = () => {
        ipcMain.handle('cache-set-pair', (_, key: string, value: any) => set(key, value));

        ipcMain.on('request-cached-state', (event) => {
            event.sender.send('response-cached-state', activeCache);
        })
    }

    export const loadCache = async () => {

        try {
            const contents = await readFile(getCacheFilepath());
            activeCache = JSON.parse(contents);

            handleStateChange();
        } catch(_) {}

    }

    export const saveCache = () => {
        writeFile(getCacheFilepath(), JSON.stringify(activeCache));
    }

    export const set = <T> (key: string, value: T) => {
        activeCache[key] = value;
        handleStateChange();
    }

    export const get = <T> (key: string) : T | undefined => {
        return activeCache[key];
    }

    const handleStateChange = () => {

        Launcher.sendWebContents('cache-state-changed', activeCache);
        App.sendWebContents('cache-state-changed', activeCache);

    }

}
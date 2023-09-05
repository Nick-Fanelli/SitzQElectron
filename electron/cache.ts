import { app, ipcMain } from "electron";
import { Launcher } from "./launcher";
import { readFile, writeFile } from "./api/machine-api";
import path from 'node:path'

export namespace ApplicationCache {

    export type CacheType = { [key: string]: any };

    let activeCache: CacheType = {};

    export const CacheFilepath = path.join(app.getPath('userData'), 'Cache', 'application-cache.json');

    export const bindCacheIPCs = () => {
        ipcMain.handle('cache-set-pair', (_, key: string, value: any) => set(key, value));

        ipcMain.on('request-cached-state', (event) => {
            event.sender.send('response-cached-state', activeCache);
        })
    }

    export const loadCache = async () => {

        try {
            const contents = await readFile(CacheFilepath);
            activeCache = JSON.parse(contents);

            handleStateChange();
        } catch(_) {}

    }

    export const saveCache = () => {
        writeFile(CacheFilepath, JSON.stringify(activeCache));
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

    }

}
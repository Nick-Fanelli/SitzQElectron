import { create } from "zustand";
import { MachineAPI } from "../../electron/api/machine-api";
import { useEffect, useRef } from "react";
import { useAppStore } from "../State/AppStore";

namespace ApplicationCache {

    const CACHE_FILENAME = 'application-cache.json';

    export type CachedProjectInfo = {
        
        projectName: string,
        showFilepath: string

    }

    export type ActiveProjectArray = [ CachedProjectInfo | null, CachedProjectInfo | null, CachedProjectInfo | null ];

    interface ApplicationCacheState {

        lastActiveProjects: ActiveProjectArray,
        setLastActiveProjects: (activeProject: ActiveProjectArray) => void

        lastOpenedProjectFilepath: string | null
        setLastOpenedProjectFilepath: (_: string | null) => void

    }

    export const useApplicationCacheStore = create<ApplicationCacheState>((set) => ({
        
        lastActiveProjects: [ null, null, null ],
        setLastActiveProjects: (lastActiveProjects: ActiveProjectArray) => set({ lastActiveProjects }),

        lastOpenedProjectFilepath: null,
        setLastOpenedProjectFilepath: (lastOpenedProjectFilepath: string | null) => set({ lastOpenedProjectFilepath })

    }))

    const getCacheFilepath = (machineAPI: MachineAPI) => {

        switch(machineAPI.osType()) {

            case 'MacOS':
                return machineAPI.pathJoin(machineAPI.homeDir, 'Library', 'Caches', `SitzQ`, 'Cache', CACHE_FILENAME);
            case 'Windows':
                return machineAPI.pathJoin('%LOCALAPPDATA%', 'SitzQ', 'Cache', CACHE_FILENAME);
            default:
            case 'Linux':
                return machineAPI.pathJoin(machineAPI.homeDir, 'Cache', `.StizQ`, CACHE_FILENAME);

        }

    }

    export const loadCache = async (machineAPI: MachineAPI): Promise<boolean> => {

        try {
            const cacheFileContents = await machineAPI.readFile(getCacheFilepath(machineAPI));
            const parsedCacheState = JSON.parse(cacheFileContents);

            useApplicationCacheStore.setState(parsedCacheState);

            return true;
        } catch(err) { // DNE
            return false;
        }
    }

    export const getAsJSON = (): string => {

        const currentState = useApplicationCacheStore.getState();
        return JSON.stringify(currentState);

    }

    export const saveCacheFromJSON = (json: string) => {

        window.electronAPI.machineAPI.writeFile(getCacheFilepath(window.electronAPI.machineAPI), json);

    }

    export const saveCache = (machineAPI: MachineAPI): string => {

        const currentState = useApplicationCacheStore.getState();

        const stateJSON = JSON.stringify(currentState);

        machineAPI.writeFile(getCacheFilepath(machineAPI), stateJSON);

        return stateJSON;
    }


    // Helper Functions
    export const pushBackRecentProject = (lastActiveProjects: ActiveProjectArray, setLastActiveProjects: (activeProject: ActiveProjectArray) => void, cachedProjectInfo: CachedProjectInfo) => {

        const indexOfActiveProjectArray = (array: ActiveProjectArray, obj: CachedProjectInfo) => {
            for (let i = 0; i < array.length; i++) {
                if (obj !== null && array[i] !== null &&
                    obj.projectName === array[i]!.projectName && obj.showFilepath === array[i]!.showFilepath) {
                    return i;
                }
            }
            return -1;
        };
        
        const index = indexOfActiveProjectArray(lastActiveProjects, cachedProjectInfo);

        const updatedLastActiveProjects: ActiveProjectArray = [...lastActiveProjects];

        if(index !== -1) {
            updatedLastActiveProjects.splice(index, 1);
        } else {
            updatedLastActiveProjects.shift();
        }
        
        updatedLastActiveProjects.push(cachedProjectInfo);

        setLastActiveProjects(updatedLastActiveProjects);

    }

}

export const ApplicationCacheElement = () => {

    const prevCacheRef = useRef<string>("");

    const isCacheLoaded = useAppStore(state => state.isCacheLoaded);
    const setIsCacheLoaded = useAppStore(state => state.setIsCacheLoaded);

    const handleWindowClosing = () => {

        ApplicationCache.saveCache(window.electronAPI.machineAPI);

    }

    const saveCache = () => {

        const json = ApplicationCache.getAsJSON();

        if(json !== prevCacheRef.current) {

            console.log("WRITING TO CACHE FILE");

            ApplicationCache.saveCacheFromJSON(json);
            prevCacheRef.current = json;

        }
    }

    useEffect(() => {

        window.electronAPI.addOnWindowClosingListener(handleWindowClosing);
        
        ApplicationCache.loadCache(window.electronAPI.machineAPI).then(() => setIsCacheLoaded(true))

        ApplicationCache.useApplicationCacheStore.subscribe(() => {
            if(isCacheLoaded)
                saveCache();
        });

        return () => {
            window.electronAPI.removeOnWindowClosingListener(handleWindowClosing);
        }

    }, [isCacheLoaded]);

    return null;

}

export default ApplicationCache;
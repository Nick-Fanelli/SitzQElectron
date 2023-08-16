import { create } from "zustand";
import { MachineAPI } from "../../electron/api/machine-api";

namespace ApplicationCache {

    const CACHE_FILENAME = 'application-cache.json';

    export type CachedProjectInfo = {
        
        projectName: string,
        showFilepath: string

    }

    type ActiveProjectArray = [ CachedProjectInfo | null, CachedProjectInfo | null, CachedProjectInfo | null ];

    interface ApplicationCacheState {

        lastActiveProjects: ActiveProjectArray,
        setLastActiveProjects: (activeProject: ActiveProjectArray) => void

    }

    export const useApplicationCacheStore = create<ApplicationCacheState>((set) => ({
        
        lastActiveProjects: [ null, null, null ],
        setLastActiveProjects: (lastActiveProjects: ActiveProjectArray) => set({ lastActiveProjects })

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

    export const saveCache = (machineAPI: MachineAPI): Promise<void> => {

        const currentState = useApplicationCacheStore.getState();

        return machineAPI.writeFile(getCacheFilepath(machineAPI), JSON.stringify(currentState));

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

export default ApplicationCache;
import { MachineAPI } from "../../electron/api/machine-api";

namespace ApplicationCache {

    const CACHE_FILENAME = 'application-cache.json';

    type Cache = {

        lastActiveProjects: [string] | null

    }

    export var activeCache: Cache = {

        lastActiveProjects: null

    }

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

        return ''

    }

    export const loadCache = async (machineAPI: MachineAPI): Promise<boolean> => {

        try {
            const cacheFileContents = await machineAPI.readFile(getCacheFilepath(machineAPI));
            const jsonCache = JSON.parse(cacheFileContents);

            activeCache = jsonCache;

            return true;
        } catch(err) { // DNE
            return false;
        }
    }

    export const saveCache = (machineAPI: MachineAPI): Promise<void> => {
        return machineAPI.writeFile(getCacheFilepath(machineAPI), JSON.stringify(activeCache))
    }


}

export default ApplicationCache;
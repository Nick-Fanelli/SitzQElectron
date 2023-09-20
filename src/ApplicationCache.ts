import { useCallback, useEffect, useState } from "react";
import { ApplicationCache } from "../electron/cache";

type ApplicationCacheKey = 'lastActiveProjects';

export interface CachedProject {

    projectName: string,
    showFilepath: string

}

export type ActiveProjectArray = [CachedProject | null, CachedProject | null, CachedProject | null]

interface ActiveCache {

    lastActiveProjects: ActiveProjectArray

}

export const useApplicationCache = (keys: (keyof ActiveCache)[]) : [ Partial<ActiveCache>, <T> (key: ApplicationCacheKey, value: T) => void, <T> (key: ApplicationCacheKey, callback: (prev: T) => T) => void ] => {

    const [ activeCache, setActiveCache ] = useState<ApplicationCache.CacheType>({});

    const assignCachePairs = useCallback((cache: ApplicationCache.CacheType) => {

        let isChanged = false;
        let updatedCachePairs: ApplicationCache.CacheType = {};

        keys.forEach((key) => {

            if(activeCache[key] !== cache[key])
                isChanged = true;

            updatedCachePairs[key] = cache[key];

        });

        if(isChanged)
            setActiveCache(updatedCachePairs);

    }, [keys, activeCache, setActiveCache]);

    const onCacheStateChanged = (_: Electron.IpcRendererEvent, cache: ApplicationCache.CacheType) => assignCachePairs(cache);

    // Bind On Change Callback
    useEffect(() => {

        const removeListener = window.electronAPI.appAPI.onCacheChange(onCacheStateChanged);
        
        window.electronAPI.appAPI.requestCachedState(onCacheStateChanged);

        return () => {
            removeListener();
        }

    }, []);

    const setCache = useCallback(<T> (key: ApplicationCacheKey, value: T) => {

        setActiveCache((prev) => {

            let updatedCache = {...prev};
            updatedCache[key] = value;

            return updatedCache;

        });

        window.electronAPI.appAPI.setCachePair(key, value);

    }, [setActiveCache]);

    const setCacheFunc = useCallback(<T> (key: string, callback: (prev: T) => T) => {

        setActiveCache((prev) => {

            const value = callback(prev[key]);

            let updatedCache = {...prev};
            updatedCache[key] = value;

            window.electronAPI.appAPI.setCachePair(key, value);

            return updatedCache;

        });


    }, [setActiveCache]);

    return [ activeCache as ActiveCache, setCache, setCacheFunc ];

}
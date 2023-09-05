import { useCallback, useEffect, useState } from "react";
import { ApplicationCache } from "../electron/cache";

type ApplicationCacheKey = 'test';

export const useApplicationCache = (keys: ApplicationCacheKey[]) : [ ApplicationCache.CacheType, <T> (key: ApplicationCacheKey, value: T) => void ] => {

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

    }, [keys, activeCache, setActiveCache])

    const onCacheStateChanged = (_: Electron.IpcRendererEvent, cache: ApplicationCache.CacheType) => assignCachePairs(cache);

    // Bind On Change Callback
    useEffect(() => {

        window.electronAPI.appAPI.addOnCacheChangeListener(onCacheStateChanged);
        
        window.electronAPI.appAPI.requestCachedState(onCacheStateChanged);

        return () => {
            window.electronAPI.appAPI.removeOnCacheChangeListener(onCacheStateChanged);
        }

    }, []);

    const setCache = <T> (key: ApplicationCacheKey, value: T) => {

        setActiveCache((prev) => {

            let updatedCache = {...prev};
            updatedCache[key] = value;

            return updatedCache;

        });

        window.electronAPI.appAPI.setCachePair(key, value);

    }

    return [ activeCache, setCache ];

}
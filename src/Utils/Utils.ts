export namespace FilepathUtils {

    export const getBasename = (filepath: string) => window.electronAPI.machineAPI.pathBasename(filepath);

}

export namespace ArrayUtils {

    export const reorderArray = (list: any[], sourceIndex: number, destinationIndex: number) : any[] => {
        const result = Array.from(list);
        const [ removed ] = result.splice(sourceIndex, 1);
        result.splice(destinationIndex, 0, removed);

        return result;
    }

}

import { RefObject, useEffect } from 'react';
import packageJSON from '../../package.json'

export namespace BuildSpecs {

    export const BUILD_VERSION = packageJSON.version;

}

export namespace HookUtils {

    export const useOnClickAway = <T extends HTMLElement = HTMLElement> (ref: RefObject<T>, handler: (event: Event) => void) => {

        useEffect(() => {

            const listener = (event: Event) => {
                const element = ref?.current;
                if(!element || element.contains(event?.target as Node) || null) {
                    return;
                }

                handler(event);
            }

            document.addEventListener('mousedown', listener);
            document.addEventListener('touchstart', listener);

            return () => {
                document.removeEventListener('mousedown', listener);
                document.removeEventListener('touchstart', listener);
            }

        }, [ref, handler]);

    }

}
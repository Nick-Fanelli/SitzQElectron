export namespace FilepathUtils {

    export const getBasename = (filepath: string) => {

        const parts = filepath.split("/");
        return parts[parts.length - 1];
        
    } 

}

export namespace ArrayUtils {

    export const reorderArray = (list: any[], startIndex: number, endIndex: number) : any[] => {
        const result = Array.from(list);
        const [ removed ] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

}

import packageJSON from '../../package.json'

export namespace BuildSpecs {

    export const BUILD_VERSION = packageJSON.version;

}
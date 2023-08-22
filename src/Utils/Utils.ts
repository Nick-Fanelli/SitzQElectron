export namespace FilepathUtils {

    export const getBasename = (filepath: string) => {

        // TODO: USE PATH to do this better

        const parts = filepath.split("/");
        return parts[parts.length - 1];
        
    } 

}

export namespace ArrayUtils {

    export const reorderArray = (list: any[], sourceIndex: number, destinationIndex: number) : any[] => {
        const result = Array.from(list);
        const [ removed ] = result.splice(sourceIndex, 1);
        result.splice(destinationIndex, 0, removed);

        return result;
    }

}

import packageJSON from '../../package.json'

export namespace BuildSpecs {

    export const BUILD_VERSION = packageJSON.version;

}
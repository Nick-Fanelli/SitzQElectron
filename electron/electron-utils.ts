import { BrowserWindow } from "electron"

// import path from 'node:path'

export namespace ElectronUtils {

    const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

    export type PathRoute = 'LanderView' | 'AppView';

    export type PropPair = {

        key: string,
        value: string

    }

    export const pathCreator = (route: PathRoute, optionalProps?: PropPair[]) : string => {

        // Parse Optional Data

        let propsString: string = "";

        if(optionalProps) {

            propsString = "?";

            optionalProps.forEach((entry, index) => {
                if(index > 0)
                    propsString += '|'

                propsString += `${entry.key}=${entry.value}`;            
            });

        }

        // Create the index path with the path route and optional data
        let indexPath: string;

        if(VITE_DEV_SERVER_URL) {
            indexPath = VITE_DEV_SERVER_URL + route + propsString;
        } else {
            return `file://${__dirname}/index.html`;

            // if(filePath.startsWith("/") || filePath.startsWith("\\"))
            //     filePath = filePath.slice(1);

            // indexPath = url.format({
            //     protocol: 'file',
            //     pathname: filePath,
            //     slashes: false
            // }) + `/${route}${propsString}`;
        }

        console.log(indexPath);

        return indexPath;

    }

    export const getFocusedWindow = (): BrowserWindow => {

        let focusedWindow = BrowserWindow.getFocusedWindow();

        if(focusedWindow === null) {

            focusedWindow = BrowserWindow.getAllWindows()[0];

        }

        return focusedWindow;
    }

}
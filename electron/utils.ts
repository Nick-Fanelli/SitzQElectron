import url from 'node:url'
import path from 'node:path'

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
        indexPath = url.format({
            protocol: 'file',
            pathname: path.join(
                process.platform === 'darwin'
                    ? __dirname.split('/').splice(0, -2).join('/')
                    : __dirname.split('\\').splice(0, -2).join('/'),
                "build",
                `index.html`
            ),
            slashes: false
        }) + `/${route}${propsString}`;
    }

    return indexPath;

}
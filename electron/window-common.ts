import path from 'node:path'

export namespace WindowCommon {

    const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

    export type PathRoute = 'LanderView' | 'AppView';

    export type PropPair = {

        key: string,
        value: string

    }

    export const getWindowURL = (route: PathRoute, optionalProps?: PropPair[]) : string => {

        let propsString: string = "?";

        if(!optionalProps)
            optionalProps = [];

        optionalProps.push({ key: '__route__', value: route });

        optionalProps.forEach((entry, index) => {
            if(index > 0)
                propsString += '|'

            propsString += `${entry.key}=${entry.value}`;            
        });

        if(VITE_DEV_SERVER_URL) {
            return VITE_DEV_SERVER_URL + propsString;
        } else {
            return 'file://' + path.join(__dirname, '../dist', 'index.html') + propsString;
        }

    }

}
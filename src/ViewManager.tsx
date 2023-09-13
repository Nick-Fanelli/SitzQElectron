import { ReactNode, useEffect, useState } from "react";
import AppView from "./AppView/AppView";
import LauncherView from "./LauncherView/LauncherView";
import { WindowCommon } from "../electron/window-common";

const ViewManager = () => {

    const [ element, setElement ] = useState<ReactNode | null>(null);

    useEffect(() => {

        let rawPathRoute: string | null = null;
        let rawProps = window.location.search;

        let props: { [key: string]: string } = {};

        if(rawProps.length !== 0) {

            rawProps = decodeURIComponent(rawProps);
            
            rawProps = rawProps.slice(1);
            const pairs = rawProps.split("|");

            pairs.forEach((pair) => {

                const items = pair.split("=");

                if(items.length !== 2) {
                    console.error("Irregular amount of prop pairs for: ", pair);
                } else {
                    if(items[0] === '__route__') {
                        rawPathRoute = items[1];
                    } else 
                        props[items[0]] = items[1];
                }

            });

        }

        if(!rawPathRoute) {

            console.error("No path route was specified!");

            return;
        }

        const pathRoute = rawPathRoute as WindowCommon.PathRoute;
        let element: ReactNode | null = null;

        switch(pathRoute) {

            case "LanderView":
                element = <LauncherView {...props} />
                break;
            case "AppView":
                element = <AppView {...props} />
                break;
            default:
                break;

        }

        setElement(element);

    }, [window.location.pathname, setElement]);

    return (
        <section id="app">
            {element}
        </section>
    );

}

export default ViewManager;
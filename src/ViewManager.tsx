import { ReactNode, useEffect, useState } from "react";
import { PathRoute } from "../electron/utils";
import AppView from "./AppView/AppView";
import LanderView from "./LanderView/LanderView";

const ViewManager = () => {

    const [ element, setElement ] = useState<ReactNode | null>(null);

    useEffect(() => {

        let rawPathRoute = window.location.pathname;
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
                    props[items[0]] = items[1];
                }

            });

        }

        if(rawPathRoute.startsWith('/'))
            rawPathRoute = rawPathRoute.slice(1);


        const pathRoute = rawPathRoute as PathRoute;
        let element: ReactNode | null = null;

        switch(pathRoute) {

            case "LanderView":
                element = <LanderView {...props} />
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
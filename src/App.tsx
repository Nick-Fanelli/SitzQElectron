import LanderView from './LanderView/LanderView'
import AppView from './AppView/AppView';

import './App.css'
import { createContext, useContext, useEffect, useState } from 'react';
import { useAppStore } from './State/AppStore';

export enum View {

    LanderView,
    AppView

}

const App = () => {

    const [ currentView, setCurrentView ] = useState<View>(View.LanderView);

    const activeProject = useAppStore((state) => state.activeProject);

    useEffect(() => {

        if(activeProject === null) {
            setCurrentView(View.LanderView);
        } else {
            setCurrentView(View.AppView);
        }

    }, [activeProject]);

    let view: any = null;

    switch(currentView) {

    case View.LanderView:
        view = <LanderView />;
        break;

    case View.AppView:
        if(activeProject !== null)
            view = <AppView showFilepath={activeProject} />;
        else 
            view = <h1>ERROR: TODO FIX ME</h1> // TODO: MAKE THIS BE AN ACTUAL PAGE TO RETURN FROM
        break;

    default:
        break;

    }

    return (
        <section id="app">
            {view}
        </section>
    )
}

export default App;

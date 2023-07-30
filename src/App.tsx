import LanderView from './LanderView/LanderView'
import AppView from './AppView/AppView';

import './App.css'
import { createContext, useContext, useState } from 'react';

export enum View {

    LanderView,
    AppView

}

const AppContext = createContext<{

    currentView: View,
    setCurrentView: React.Dispatch<React.SetStateAction<View>>

} | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);

    if(!context) 
        throw new Error("useAppContext must be used within a AppContextProvider");

    return context;
}

const App = () => {

    const [ currentView, setCurrentView ] = useState<View>(View.AppView);

    let view: any = null;

    switch(currentView) {

    case View.LanderView:
        view = <LanderView />;
        break;

    case View.AppView:
        view = <AppView showFilepath={"/Users/nickfanelli/Desktop/Example Project/Example Project.sqshow"} />;
        break;

    default:
        break;

    }

    return (
        <AppContext.Provider value={{ currentView, setCurrentView }}>
            <section id="app">
                {view}
            </section>
        </AppContext.Provider>
    )
}

export default App;

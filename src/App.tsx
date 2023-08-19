import AppView from './AppView/AppView';
import LanderView from './LanderView/LanderView';

import { useEffect, useState } from 'react';
import './App.css';
import { useAppStore } from './State/AppStore';
import ApplicationCache from './Utils/ApplicationCache';

export enum View {

    LanderView,
    AppView

}

const App = () => {

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ currentView, setCurrentView ] = useState<View>(View.LanderView);

    const activeProject = useAppStore((state) => state.activeProject);
    const setActiveProject = useAppStore((state) => state.setActiveProject);

    const onFileOpened = (_: any, filepath: string) => {
        console.log("Opening project at filepath: " + filepath);
        setActiveProject(filepath);
    }

    // Handle Open Project File
    useEffect(() => {

        window.electronAPI.appAPI.getApplicationOpenedFile((filepath: string) => {
            alert(filepath);
            setActiveProject(filepath);
        })

        window.electronAPI.appAPI.addOnFileOpenedListener(onFileOpened);

        return () => {
            window.electronAPI.appAPI.removeOnFileOpenedListener(onFileOpened);
        }

    }, []);

    useEffect(() => {

        if(activeProject === null) {
            setCurrentView(View.LanderView);
        } else {
            setCurrentView(View.AppView);
        }

    }, [activeProject]);

    const handleWindowClosing = () => { // On Window Close

        ApplicationCache.saveCache(window.electronAPI.machineAPI);

    }

    // Load Cache
    useEffect(() => {

        window.electronAPI.addOnWindowClosingListener(handleWindowClosing);

        ApplicationCache.loadCache(window.electronAPI.machineAPI).then(() => { setIsLoading(false); })

        return () => {
            window.electronAPI.removeOnWindowClosingListener(handleWindowClosing);
        }

    }, [setIsLoading]);

    let view: any = null;

    switch(currentView) {

    case View.LanderView:
        view = <LanderView />;
        break;

    case View.AppView:
        if(activeProject !== null)
            view = <AppView showFilepath={activeProject} />;
        else 
            setCurrentView(View.LanderView);
        break;

    default:
        break;

    }

    return (
        <section id="app">
            { 
                isLoading ? 
                    // TODO: REPLACE WITH LOADING SCREEN
                    <h1>Loading...</h1>
                :
                    view
                }
        </section>
    )
}

export default App;

import AppView from './AppView/AppView';
import LanderView from './LanderView/LanderView';

import { useEffect } from 'react';
import './App.css';
import { useAppStore } from './State/AppStore';
import { ApplicationCacheElement } from './Utils/ApplicationCache';

export enum View {

    LanderView,
    AppView

}

const App = () => {

    const activeProject = useAppStore((state) => state.activeProject);
    const setActiveProject = useAppStore((state) => state.setActiveProject);

    const isCacheLoaded = useAppStore(state => state.isCacheLoaded);

    const onFileOpened = (_: any, filepath: string) => {
        console.log("Opening project at filepath: " + filepath);
        setActiveProject(filepath);
    }

    // Handle Open Project File
    useEffect(() => {

        window.electronAPI.appAPI.getApplicationOpenedFile((filepath: string) => {
            setActiveProject(filepath);
        })

        window.electronAPI.appAPI.addOnFileOpenedListener(onFileOpened);

        return () => {
            window.electronAPI.appAPI.removeOnFileOpenedListener(onFileOpened);
        }

    }, []);

    const isReady = isCacheLoaded;

    let view: any = null;

    if(isReady) {
        view = activeProject === null ? <LanderView /> : <AppView/>;
    } else {
        view = <h1>Loading...</h1> // TODO: REPLACE W/ LOADING
    }

    return (
        <>
            <ApplicationCacheElement />
            <section id="app">
                {view}
            </section>
        </>
    )
}

export default App;

import Header from './Components/HeaderComponent'
import CueListComponent from './Components/CueListComponent'
import CuePropertiesComponent from './Components/CuePropertiesComponent'
import StatusBarComponent from './Components/StatusBarComponent'

import { ProjectUtils } from '../Core/Project'

import './AppView.css'
import { createContext, useContext, useEffect, useState } from 'react'
import { useProjectStore } from './State/AppViewStore'
import LoadingComponent from '../Components/LoadingComponent'
import ApplicationCache from '../Utils/ApplicationCache'
import { shallow } from 'zustand/shallow'
import { useAppStore } from '../State/AppStore'

const AppViewContext = createContext<{

} | null>(null);

export const useAppViewContext = () => {

    const context = useContext(AppViewContext);

    if(!context)
        throw new Error("useAppViewContext must be used within an AppViewContext.Provider");

    return context;

}

const AppView = () => {

    const [ isLoaded, setIsLoaded ] = useState<boolean>(false);

    const activeProject = useAppStore(state => state.activeProject);

    const setProjectName = useProjectStore((state) => state.setProjectName);

    const [ lastActiveProjects, setLastActiveProjects ] = ApplicationCache.useApplicationCacheStore(state => [ state.lastActiveProjects, state.setLastActiveProjects ], shallow);

    useEffect(() => {
        ProjectUtils.loadProjectFromShowFile(window.electronAPI.machineAPI, activeProject!).then((res) => {

            setProjectName(res.projectName);
            setIsLoaded(true);

            // Save Open Project to Cache
            ApplicationCache.pushBackRecentProject(lastActiveProjects, setLastActiveProjects, { projectName: res.projectName, showFilepath: activeProject! });

        });

    }, [activeProject, setIsLoaded, setProjectName]);

    return (
        !isLoaded ?

            <div className='loading-drag-window'>
                <LoadingComponent loadingText='Loading Project...' size="50%" autoHeight={true} />
            </div>
            
        :

            <AppViewContext.Provider value={{}}>
                <section id="app-view">
                    <div className="top">
                        <Header />
                    </div>

                    <div className="main">
                        <CueListComponent />
                        <CuePropertiesComponent />
                    </div>

                    <div className="bottom">
                        <StatusBarComponent />
                    </div>
                </section>
            </AppViewContext.Provider>
    )

}

export default AppView;
import Header from './Components/HeaderComponent'
import CueListComponent from './Components/CueListComponent'
import CuePropertiesComponent from './Components/CuePropertiesComponent'
import StatusBarComponent from './Components/StatusBarComponent'

import { ProjectUtils } from '../Core/Project'

import './AppView.css'
import { useEffect, useState } from 'react'
import { useProjectStore } from './State/AppViewStore'
import LoadingComponent from '../Components/LoadingComponent'
import ApplicationCache from '../Utils/ApplicationCache'
import { shallow } from 'zustand/shallow'
import { useAppStore } from '../State/AppStore'


const HandleProjectAutoSaveComponent = () => {

    const projectFilepath = useAppStore(state => state.activeProject);

    const projectName       = useProjectStore(state => state.projectName);
    const cueList           = useProjectStore(state => state.cueList);

    const handleOnWindowClose = () => {

        if(projectFilepath === null)
            return;

        const reconstructedProject = ProjectUtils.reconstructProject(projectName, cueList);
        ProjectUtils.saveProjectToShowFile(projectFilepath, reconstructedProject);
    }

     // On Window Close
     useEffect(() => {

        window.electronAPI.addOnWindowClosingListener(handleOnWindowClose);

        return () => {
            window.electronAPI.removeOnWindowClosingListener(handleOnWindowClose);
        }

    });

    return (
        <button onClick={handleOnWindowClose}>Save Me</button>
    );

}

const AppView = () => {

    // Component State
    const [ isLoaded, setIsLoaded ] = useState<boolean>(false);

    // App Store
    const activeProject = useAppStore(state => state.activeProject);
    
    // Project Store
    const setProjectName        = useProjectStore((state) => state.setProjectName);
    const setCueList            = useProjectStore(state => state.setCueList);

    // Cache Store
    const [ lastActiveProjects, setLastActiveProjects ] = ApplicationCache.useApplicationCacheStore(state => [ state.lastActiveProjects, state.setLastActiveProjects ], shallow);
    const setLastOpenedProjectFilepath                  = ApplicationCache.useApplicationCacheStore(state => state.setLastOpenedProjectFilepath);

    // ==========================================================================================
    // Project Loads Into App View Here
    // ==========================================================================================
    useEffect(() => {
        ProjectUtils.loadProjectFromShowFile(activeProject!).then((res) => {

            setProjectName(res.projectName);
            setCueList(res.cueList === null ? [] : res.cueList);
            
            setIsLoaded(true);

            // Save Open Project to Cache
            ApplicationCache.pushBackRecentProject(lastActiveProjects, setLastActiveProjects, { projectName: res.projectName, showFilepath: activeProject! });
            setLastOpenedProjectFilepath(activeProject);

        });
    }, [activeProject, setIsLoaded, setProjectName]);

    return (
        !isLoaded ?

            <div className='loading-drag-window'>
                <LoadingComponent loadingText='Loading Project...' size="50%" autoHeight={true} />
            </div>
            
        :
        <>
            <HandleProjectAutoSaveComponent />
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
        </>
    )

}

export default AppView;
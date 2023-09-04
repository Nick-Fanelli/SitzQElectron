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

interface HandleProjectAutoSaveComponentProps {

    projectFilepath: string

}

const HandleProjectAutoSaveComponent = ({ projectFilepath }: HandleProjectAutoSaveComponentProps) => {

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
        null
        // <button onClick={handleOnWindowClose}>Save Me</button>
    );

}

interface AppViewProps {

    projectFilepath?: string

}

const AppView = ({ projectFilepath }: AppViewProps) => {

    if(!projectFilepath)
        return null;

    console.log(projectFilepath);

    // Component State
    const [ isLoaded, setIsLoaded ] = useState<boolean>(false);

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
        ProjectUtils.loadProjectFromShowFile(projectFilepath).then((res) => {

            setProjectName(res.projectName);
            setCueList(res.cueList === null ? [] : res.cueList);
            
            setIsLoaded(true);

            // Save Open Project to Cache
            ApplicationCache.pushBackRecentProject(lastActiveProjects, setLastActiveProjects, { projectName: res.projectName, showFilepath: projectFilepath });
            setLastOpenedProjectFilepath(projectFilepath);

        });
    }, [projectFilepath, setIsLoaded, setProjectName]);

    return (
        !isLoaded ?

            <div className='loading-drag-window'>
                <LoadingComponent loadingText='Loading Project...' size="50%" autoHeight={true} />
            </div>
            
        :
        <>
            <HandleProjectAutoSaveComponent projectFilepath={projectFilepath} />
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
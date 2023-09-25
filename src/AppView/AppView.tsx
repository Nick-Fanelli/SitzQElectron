import Header from './Components/HeaderComponent'
import CueListComponent from './Components/CueListComponent'
import CuePropertiesComponent from './Components/CuePropertiesComponent'
import StatusBarComponent from './Components/StatusBarComponent'

import { ProjectUtils } from '../Core/Project'

import './AppView.css'
import { useCallback, useEffect, useState } from 'react'
import { useProjectStore } from './State/AppViewStore'
import LoadingComponent from '../Components/LoadingComponent'
import { ActiveProjectArray, CachedProject, useApplicationCache } from '../ApplicationCache'

interface HandleProjectAutoSaveComponentProps {  

    projectFilepath: string

}

const HandleProjectAutoSaveComponent = ({ projectFilepath }: HandleProjectAutoSaveComponentProps) => {

    const projectName       = useProjectStore(state => state.projectName);
    const cueList           = useProjectStore(state => state.cueList);

    const handleSaveProject = useCallback(() => {

        if(projectFilepath === null)
            return;
        
        const reconstructedProject = ProjectUtils.reconstructProject(projectName, cueList);
        ProjectUtils.saveProjectToShowFile(projectFilepath, reconstructedProject);

    }, [projectFilepath, projectName, cueList]);

     // On Window Close
     useEffect(() => {

        const removeOnWindowClosingListener = window.electronAPI.onWindowClosing(handleSaveProject);
        const removeOnProjectSaveListener = window.electronAPI.appAPI.onRequestProjectSave(handleSaveProject);
        
        return () => {
            removeOnWindowClosingListener();
            removeOnProjectSaveListener();
        }

    }, [projectFilepath, projectName, cueList]);

    return (
        null
    );

}

interface AppViewProps {

    projectFilepath?: string
    
}

const AppView = ({ projectFilepath }: AppViewProps) => {

    if(!projectFilepath)
        return null;

    // Component State
    const [ isLoaded, setIsLoaded ] = useState<boolean>(false);

    // Project Store
    const setProjectName        = useProjectStore((state) => state.setProjectName);
    const setCueList            = useProjectStore(state => state.setCueList);

    const [ _, __, setCache ]   = useApplicationCache(['lastActiveProjects']);

    // ==========================================================================================
    // Project Loads Into App View Here
    // ==========================================================================================
    useEffect(() => {
        ProjectUtils.loadProjectFromShowFile(projectFilepath).then((res) => {

            setProjectName(res.projectName);
            setCueList(res.cueList === null ? [] : res.cueList);
            
            setIsLoaded(true);

            const cachedProjectInfo: CachedProject = { projectName: res.projectName, showFilepath: projectFilepath };

            // Report the active project to be cached
            setCache('lastActiveProjects', (prev: ActiveProjectArray | undefined) => {

                if(!prev || prev == undefined)
                    prev = [null, null, null];

                console.log(prev);

                const indexOfActiveProjectArray = (array: ActiveProjectArray, obj: CachedProject) => {
                    for (let i = 0; i < array.length; i++) {
                        if (obj !== null && array[i] !== null &&
                            obj.projectName === array[i]!.projectName && obj.showFilepath === array[i]!.showFilepath) {
                            return i;
                        }
                    }
                    return -1;
                };

                const index = indexOfActiveProjectArray(prev, cachedProjectInfo);

                const updatedLastActiveProjects: ActiveProjectArray = [...prev];

                if(index !== -1) {
                    updatedLastActiveProjects.splice(index, 1);
                } else {
                    updatedLastActiveProjects.shift();
                }

                updatedLastActiveProjects.push(cachedProjectInfo);

                return updatedLastActiveProjects;
                
            });

        });
    }, [projectFilepath, setIsLoaded, setProjectName, setCache]);

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
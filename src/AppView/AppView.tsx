import Header from './Components/HeaderComponent'
import CueTemplateComponent from './Components/CueTemplateComponent'
import CueListComponent from './Components/CueListComponent'
import CuePropertiesComponent from './Components/CuePropertiesComponent'
import StatusBarComponent from './Components/StatusBarComponent'

import Project, { ProjectUtils } from '../Core/Project'

import './AppView.css'
import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { Cue } from '../Core/Cue'

const AppViewContext = createContext<{

    projectName: string,
    setProjectName: React.Dispatch<React.SetStateAction<string>>,

    cueList: Cue[] | null,
    setCueList: React.Dispatch<React.SetStateAction<Cue[] | null>>

} | null>(null);

export const useAppViewContext = () => {

    const context = useContext(AppViewContext);

    if(!context)
        throw new Error("useAppViewContext must be used within an AppViewContext.Provider");

    return context;

}

interface Props {

    showFilepath: string

}

const AppView = (props: Props) => {

    const [ isLoaded, setIsLoaded ] = useState<boolean>(false);

    const [ projectName, setProjectName ] = useState<string>("");
    const [ cueList, setCueList ] = useState<Cue[] | null>(null);

    const autoSaveProject = useRef<Project | null>(null);

    // useEffect(() => {

    //     autoSaveProject.current.cueList = cueList;

    // }, [cueList, autoSaveProject.current])

    useEffect(() => {
        ProjectUtils.loadProjectFromShowFile(window.electronAPI.machineAPI, props.showFilepath).then((res) => {

            setProjectName(res.projectName);
            setCueList(res.cueList);

            setIsLoaded(true);

            autoSaveProject.current = res;
        });

    }, [props.showFilepath, setIsLoaded, setProjectName, setCueList, autoSaveProject]);

    return (
        !isLoaded ?

            <h1>Loading Project...</h1>

        :

            <AppViewContext.Provider value={{ projectName, setProjectName, cueList, setCueList }}>
                <section id="app-view">
                    <div className="top">
                        <Header />
                        <CueTemplateComponent />
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
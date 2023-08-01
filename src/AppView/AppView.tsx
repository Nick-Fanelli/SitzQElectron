import Header from './Components/HeaderComponent'
import CueTemplateComponent from './Components/CueTemplateComponent'
import CueListComponent from './Components/CueListComponent'
import CuePropertiesComponent from './Components/CuePropertiesComponent'
import StatusBarComponent from './Components/StatusBarComponent'

import { ProjectUtils } from '../Core/Project'

import './AppView.css'
import { createContext, useContext, useEffect, useState } from 'react'
import { useProjectStore } from './State/Store'
import LoadingComponent from '../Components/LoadingComponent'

const AppViewContext = createContext<{

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

    const setProjectName = useProjectStore((state) => state.setProjectName);

    useEffect(() => {
        ProjectUtils.loadProjectFromShowFile(window.electronAPI.machineAPI, props.showFilepath).then((res) => {

            setProjectName(res.projectName);

            // setIsLoaded(true);

        });

    }, [props.showFilepath, setIsLoaded, setProjectName]);

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
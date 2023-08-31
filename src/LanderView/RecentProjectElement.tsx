import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppStore } from "../State/AppStore";
import ApplicationCache from "../Utils/ApplicationCache";
import { faGreaterThan, faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ContextMenu from "../Utils/ContextMenu";

type Props = {

    cachedProject: ApplicationCache.CachedProjectInfo

}

const initialContextMenu = {

    show: false,
    
    x: 0,
    y: 0

}

const RecentProjectElement = (props: Props) => {

    const setActiveProject = useAppStore(state => state.setActiveProject);

    const lastActiveProjects = ApplicationCache.useApplicationCacheStore(state => state.lastActiveProjects);
    const setLastActiveProjects = ApplicationCache.useApplicationCacheStore(state => state.setLastActiveProjects);

    const [ contextMenu, setContextMenu ] = useState(initialContextMenu);

    const handleOpenProjectFromCache = (cachedProjectInfo: ApplicationCache.CachedProjectInfo) => {

        // TODO: VALIDATE SHOW FILEPATH STILL EXISTS OTHERWISE REMOVE FROM CACHE AND DON'T OPEN
        setActiveProject(cachedProjectInfo.showFilepath);

    }

    const handleContextMenu = (event : React.MouseEvent<HTMLLIElement, globalThis.MouseEvent>) => {

        event.preventDefault();

        const { pageX, pageY } = event;
        setContextMenu({ show: true, x: pageX, y: pageY });

    }

    const contextMenuClose = () => setContextMenu(initialContextMenu);

    return (
        <>
            <li 
                onClick={() => handleOpenProjectFromCache(props.cachedProject)}
                onContextMenu={(event) => handleContextMenu(event) }
            >
                <p>{props.cachedProject.projectName}</p>
                <FontAwesomeIcon className="icon" icon={faGreaterThan} />
            </li>
            
            { 
            contextMenu.show && <ContextMenu

                menuItems={[
                    { label: "Remove", icon: faX, onClick: () => {
            
                        const updatedLastActiveProjects = [...lastActiveProjects];
                        const index = updatedLastActiveProjects.indexOf(props.cachedProject);

                        if(index !== -1) {

                            updatedLastActiveProjects.splice(index, 1);
                            updatedLastActiveProjects.push(null);

                            setLastActiveProjects(updatedLastActiveProjects as ApplicationCache.ActiveProjectArray);

                        }

                    } }
                ]}

                x={contextMenu.x} 
                y={contextMenu.y} 

                closeContextMenu={contextMenuClose} 
            /> 
            }
        </>
    )

}

export default RecentProjectElement;
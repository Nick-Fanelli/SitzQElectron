import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ContextMenu from "../Utils/ContextMenu";
import { ActiveProjectArray, CachedProject, useApplicationCache } from "../ApplicationCache";

type Props = {

    cachedProject: CachedProject
    handleOpenProject: (showFilepath: string) => void

}

const initialContextMenu = {

    show: false,
    
    x: 0,
    y: 0

}

const RecentProjectElement = (props: Props) => {

    const [ contextMenu, setContextMenu ] = useState(initialContextMenu);

    const [ cache, setCache ] = useApplicationCache([ 'lastActiveProjects' ]);

    const handleOpenProjectFromCache = (CachedProject: CachedProject) => props.handleOpenProject(CachedProject.showFilepath);

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

                            if(cache.lastActiveProjects) {
                
                            const updatedLastActiveProjects = [...cache.lastActiveProjects];
                            const index = updatedLastActiveProjects.indexOf(props.cachedProject);

                            if(index !== -1) {

                                updatedLastActiveProjects.splice(index, 1);
                                updatedLastActiveProjects.push(null);

                                setCache('lastActiveProjects', updatedLastActiveProjects as ActiveProjectArray);

                            }
                        }

                    }}
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
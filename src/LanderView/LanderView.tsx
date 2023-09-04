import { BuildSpecs } from '../Utils/Utils'
import { ProjectUtils } from '../Core/Project'

import logoIcon  from '../Resources/logo-icon.png'

import './LanderView.css'
import { useCallback, useEffect, useRef, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faPlus } from '@fortawesome/free-solid-svg-icons'
import ApplicationCache from '../Utils/ApplicationCache'
import RecentProjectElement from './RecentProjectElement'
import AppConstants from '../AppConstants'
import { useAppConstantsStore } from '../State/AppStore'

const DefaultBuildVersion = `${BuildSpecs.BUILD_VERSION}`;

const LanderView = () => {

    const api = window.electronAPI;

    const isCacheLoaded = useAppConstantsStore(state => state.isCacheLoaded);

    const lastActiveProjects = ApplicationCache.useApplicationCacheStore(state => state.lastActiveProjects);

    const [ versionOutput, setVersionOutput ] = useState<string>(DefaultBuildVersion);

    const slidingContentRef = useRef<HTMLDivElement>(null);
    const fadingContentRef = useRef<HTMLDivElement>(null);

    const assignFadeInAnimation = () => {
        fadingContentRef.current!.classList.add("fadeIn");
    }   

    const toggleVersion = useCallback(() => {
    
        setVersionOutput((prev) => {
            if(prev === DefaultBuildVersion) {
                const updatedBuildVersion = `${BuildSpecs.BUILD_VERSION}-${api.machineAPI.arch}-${api.machineAPI.osVersion}`;

                return updatedBuildVersion;

            } else {
                return DefaultBuildVersion;
            }
        }); 

    }, [setVersionOutput]);

    useEffect(() => {

        if(slidingContentRef.current) {
            slidingContentRef.current.addEventListener("animationend", assignFadeInAnimation);
        }

        return () => {
            slidingContentRef.current?.removeEventListener("animationend", assignFadeInAnimation);
        }

    }, [slidingContentRef.current]);

    const handleNewProject = () => {

        // Setup Project Structure
        api.machineAPI.createDirectory().then((value) => {
            ProjectUtils.createProjectFromDirectory(value).then((showFilepath) => {
                handleOpenProjectFromShowFilepath(showFilepath);
            });
        });

    }

    const handleOpenProjectDialog = () => {
        api.appAPI.openProject().then((value) => {
            handleOpenProjectFromShowFilepath(value);
        });
    }

    const handleOpenProjectFromShowFilepath = (showFilepath: string) => {

        window.electronAPI.appAPI.launchProject(showFilepath);

    }

    return (
        <>
            <AppConstants />
            {
                isCacheLoaded &&
                <section id="lander-view">
                    <div className='container'>
                        <div ref={slidingContentRef} className='sliding-content'>
                            <img src={logoIcon} alt="SitzQ Icon Logo" className='logo' />
                            <h1>SitzQ</h1>
                            <h3 onClick={toggleVersion} className='interactable'>{versionOutput}</h3>
                        </div>

                        <div ref={fadingContentRef} className="fading-content">

                            <div className="recent-projects">
                                <div>
                                    <ul className='interactable'>
                                        {
                                            lastActiveProjects &&
                                            lastActiveProjects.map((project, index) => {
                                                if(project != null) {
                                                    return <RecentProjectElement key={index} cachedProject={project} handleOpenProject={handleOpenProjectFromShowFilepath} />
                                                } else {
                                                    return null;
                                                }
                                            }).reverse()
                                        }
                                    </ul>
                                </div>
                            </div>

                            <div className="control-buttons interactable">

                                <FontAwesomeIcon icon={faFolder} onClick={handleOpenProjectDialog} className='icon' />
                                <FontAwesomeIcon icon={faPlus} onClick={handleNewProject} className='icon' />
                                {/* <button onClick={() => { window.electronAPI.appAPI.launchSecondaryWindow(); }}>Launch Secondary Window</button> */}

                            </div>

                        </div>

                    </div>

                </section>
            }
        </>
    )

}

export default LanderView;
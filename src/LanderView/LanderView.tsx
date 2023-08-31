import { BuildSpecs } from '../Utils/Utils'
import { ProjectUtils } from '../Core/Project'

import logoIcon  from '../Resources/logo-icon.png'

import './LanderView.css'
import { useCallback, useEffect, useRef, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useAppStore } from '../State/AppStore'
import ApplicationCache from '../Utils/ApplicationCache'
import RecentProjectElement from './RecentProjectElement'

const DefaultBuildVersion = `${BuildSpecs.BUILD_VERSION}`;

const Lander = () => {

    const api = window.electronAPI;

    const lastActiveProjects = ApplicationCache.useApplicationCacheStore(state => state.lastActiveProjects);

    const [ versionOutput, setVersionOutput ] = useState<string>(DefaultBuildVersion);

    const slidingContentRef = useRef<HTMLDivElement>(null);
    const fadingContentRef = useRef<HTMLDivElement>(null);

    const setActiveProject = useAppStore((state) => state.setActiveProject);

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
                setActiveProject(showFilepath);
            });
        });

    }

    const handleOpenProject = () => {

        api.appAPI.openProject().then((value) => {

            setActiveProject(value);

        })

    }
    return (
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
                                            return <RecentProjectElement key={index} cachedProject={project} />
                                        } else {
                                            return null;
                                        }
                                    }).reverse()
                                }
                            </ul>
                        </div>
                    </div>

                    <div className="control-buttons interactable">

                        <FontAwesomeIcon icon={faFolder} onClick={handleOpenProject} className='icon' />
                        <FontAwesomeIcon icon={faPlus} onClick={handleNewProject} className='icon' />

                    </div>

                </div>

            </div>

        </section>
    )

}

export default Lander;
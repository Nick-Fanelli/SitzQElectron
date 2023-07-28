import { BuildSpecs } from '../Utils/Utils'

import logoIcon  from '../Resources/logo-icon.png'

import './LanderView.css'
import { useCallback, useEffect, useRef, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faGreaterThan, faPlus } from '@fortawesome/free-solid-svg-icons'

const Lander = () => {

    const [ versionOutput, setVersionOutput ] = useState<string>(BuildSpecs.BUILD_VERSION);

    const slidingContentRef = useRef<HTMLDivElement>(null);
    const fadingContentRef = useRef<HTMLDivElement>(null);

    const assignFadeInAnimation = () => {
        fadingContentRef.current!.classList.add("fadeIn");
    }   

    const toggleVersion = useCallback(() => {

        setVersionOutput((prev) => prev === BuildSpecs.BUILD_VERSION ? "TODO: REPLACE WITH LONGER BUILD VERSION" : BuildSpecs.BUILD_VERSION);

    }, [setVersionOutput]);

    const notify = () => {

        (window as any).api.send("notify");

    }

    useEffect(() => {

        if(slidingContentRef.current) {
            slidingContentRef.current.addEventListener("animationend", assignFadeInAnimation);
        }

        return () => {
            slidingContentRef.current?.removeEventListener("animationend", assignFadeInAnimation);
        }

    }, [slidingContentRef.current]);

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
                                <li>
                                    <p>Example Project 1</p>
                                    <FontAwesomeIcon className="icon" icon={faGreaterThan} />
                                </li>
                                <li>
                                    <p>Example Project 2</p>
                                    <FontAwesomeIcon className="icon" icon={faGreaterThan} />
                                </li>
                                <li>
                                    <p>Example Project 3</p>
                                    <FontAwesomeIcon className="icon" icon={faGreaterThan} />
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="control-buttons interactable">

                        <FontAwesomeIcon icon={faFolder} className='icon' />
                        <FontAwesomeIcon icon={faPlus} onClick={notify} className='icon' />

                    </div>

                </div>

            </div>

        </section>
    )

}

export default Lander;
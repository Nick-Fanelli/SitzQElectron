import { BuildSpecs } from '../Utils/Utils'

import logoIcon  from '../Resources/logo-icon.png'

import './LanderView.css'
import { useCallback, useEffect, useRef, useState } from 'react'

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
            <div className="header"></div>

            <div className='container'>
                <div ref={slidingContentRef} className='sliding-content'>
                    <img src={logoIcon} alt="SitzQ Icon Logo" className='logo' />
                    <h1>SitzQ</h1>
                    <h3 onClick={toggleVersion}>{versionOutput}</h3>
                </div>

                <div ref={fadingContentRef} className="fading-content">

                    <button>Create Project</button>
                    <button>Open Project</button>

                </div>

            </div>

        </section>
    )

}

export default Lander;
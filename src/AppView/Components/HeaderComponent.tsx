import HiddenInputComponent from './HiddenInputComponent'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import './HeaderComponent.css'
import { useState } from 'react'
import { View, useAppContext } from '../../App'

const Header = () => {

    const [ projectName, setProjectName ] = useState<string>("Development Project");
    
    const appContext = useAppContext();

    const handleGoBack = () => {

        // TODO: SAVE PROJECT ETC...
        
        appContext.setCurrentView(View.LanderView);

    }

    return (
        <>
        <section id="header">

            <div>
            </div>

            <div>
                <div className="back-arrow" onClick={handleGoBack}>
                    <div className="arrow"></div>
                </div>

                <HiddenInputComponent className="project-name" value={projectName} setValue={setProjectName} />
            </div>

            <div>
                <FontAwesomeIcon icon={faGear} className="settings-btn" onClick={() => { console.log("Hey") }} />
            </div>

        </section>
        </>
    )

}

export default Header;
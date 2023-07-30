import HiddenInputComponent from './HiddenInputComponent'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import './HeaderComponent.css'
import { View, useAppContext } from '../../App'
import { useAppViewContext } from '../AppView'

const Header = () => {

    const appContext = useAppContext();
    const appViewContext = useAppViewContext();

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

                <HiddenInputComponent className="project-name" value={appViewContext.projectName} setValue={appViewContext.setProjectName} />
            </div>

            <div>
                <FontAwesomeIcon icon={faGear} className="settings-btn" onClick={() => { console.log("Hey") }} />
            </div>

        </section>
        </>
    )

}

export default Header;
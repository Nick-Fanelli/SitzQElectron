import HiddenInputComponent from './HiddenInputComponent'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import './HeaderComponent.css'
import { useProjectStore } from '../State/AppViewStore'
import { useAppStore } from '../../State/AppStore'

const Header = () => {

    const projectName = useProjectStore((state) => state.projectName);
    const setProjectName = useProjectStore((state) => state.setProjectName);

    const setActiveProject = useAppStore((state) => state.setActiveProject);

    const handleGoBack = () => {

        // TODO: SAVE PROJECT ETC...

        setActiveProject(null);

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
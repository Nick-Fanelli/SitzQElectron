import HiddenInputComponent from './HiddenInputComponent'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import './HeaderComponent.css'
import { useProjectStore } from '../State/AppViewStore'

const Header = () => {

    const projectName = useProjectStore((state) => state.projectName);
    const setProjectName = useProjectStore((state) => state.setProjectName);

    return (
        <>
        <section id="header">

            <div>
            </div>

            <div>
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
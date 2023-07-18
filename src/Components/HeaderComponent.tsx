import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import './HeaderComponent.css'

const Header = () => {

    return (
        <>
        <section id="header">

            <div>
            </div>

            <div>
                <input type="text" defaultValue="Development Project" className="project-name hidden-input" />
            </div>

            <div>
                <FontAwesomeIcon icon={faGear} className="settings-btn" onClick={() => { console.log("Hey") }} />
            </div>

        </section>
        </>
    )

}

export default Header;
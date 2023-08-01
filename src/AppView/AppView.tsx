import Header from './Components/HeaderComponent'
import CueTemplateComponent from './Components/CueTemplateComponent'
import CueListComponent from './Components/CueListComponent'
import CuePropertiesComponent from './Components/CuePropertiesComponent'
import StatusBarComponent from './Components/StatusBarComponent'

import './AppView.css'

const AppView = () => {

    return (
        <section id="app-view">
            <div className="top">
                <Header />
                <CueTemplateComponent />
            </div>

            <div className="main">
                <CueListComponent />
                <CuePropertiesComponent />
            </div>

            <div className="bottom">
                <StatusBarComponent />
            </div>
        </section>
    )

}

export default AppView;
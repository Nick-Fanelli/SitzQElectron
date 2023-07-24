import Header from './Components/HeaderComponent'
import CueTemplateComponent from './Components/CueTemplateComponent'
import CueListComponent from './Components/CueListComponent'
import CuePropertiesComponent from './Components/CuePropertiesComponent'
import StatusBarComponent from './Components/StatusBarComponent'

import './AppView.css'

const AppView = () => {

    return (
        <section id="app-view">
            <Header />
            <CueTemplateComponent />
            <CueListComponent />
            <CuePropertiesComponent />
            <StatusBarComponent />
        </section>
    )

}

export default AppView;
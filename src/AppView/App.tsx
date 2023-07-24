import Header from './Components/HeaderComponent'
import CueTemplateComponent from './Components/CueTemplateComponent'
import CueListComponent from './Components/CueListComponent'
import CuePropertiesComponent from './Components/CuePropertiesComponent'
import StatusBarComponent from './Components/StatusBarComponent'

import './App.css'

function App() {

    return (
        <section id="app">
            <Header />
            <CueTemplateComponent />
            <CueListComponent />
            <CuePropertiesComponent />
            <StatusBarComponent />
        </section>
    )
}

export default App

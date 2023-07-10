import './App.css'

import Dockspace from './Components/Docking/Dockspace'
import Window from './Components/Docking/Window';

function App() {

    return (
        <>
            <Dockspace>
                <Window title="Example Window" windowPreferences={{minimumWidth: 100, minimumHeight: 100}}>
                </Window>
            </Dockspace>
        </>
    )
}

export default App;

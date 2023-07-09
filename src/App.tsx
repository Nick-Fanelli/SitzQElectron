import './App.css'

import Dockspace from './Components/Docking/Dockspace'
import Window from './Components/Docking/Window';

function App() {

    return (
        <>
            <Dockspace>
                <Window title="Example Window">
                    <h1>Some Window</h1>
                </Window>
            </Dockspace>
        </>
    )
}

export default App;

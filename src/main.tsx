import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import ViewManager from './ViewManager.tsx'

const launchApplication = () => {

    runReactApp();
    
}

const runReactApp = () => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <React.StrictMode>
            <ViewManager />
        </React.StrictMode>
    )
    
    postMessage({ payload: 'removeLoading' }, '*')
}

launchApplication();

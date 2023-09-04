import { useEffect } from 'react';
import './App.css';

const AppConstants = () => {

    const onFileOpened = (_: any, filepath: string) => {
        // TODO: JUST RUN ALL ON BACKEND DON'T KICK PAST ELECTRONS API
        window.electronAPI.appAPI.launchProject(filepath);
    }

    // Handle Open Project File
    useEffect(() => {

        window.electronAPI.appAPI.getApplicationOpenedFile((filepath: string) => {
            window.electronAPI.appAPI.launchProject(filepath);
        })

        window.electronAPI.appAPI.addOnFileOpenedListener(onFileOpened);

        return () => {
            window.electronAPI.appAPI.removeOnFileOpenedListener(onFileOpened);
        }

    }, []);

    return (
        null
    );
}

export default AppConstants;

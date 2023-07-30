import os from 'os';

// =====================================================================================
// Operating System API
// =====================================================================================

interface OperatingSystemAPI {

    osVersion: string
    homeDir: string
    arch: string

}

export const osAPI: OperatingSystemAPI = {

    osVersion: os.version(),
    homeDir: os.homedir(),
    arch: os.arch()

}

// =====================================================================================
// Electron API
// =====================================================================================

interface ElectronAPI {

    osAPI: OperatingSystemAPI

}

export const boundElectronAPI : ElectronAPI = {

    osAPI

}

interface APIWindowContext extends Window {

    electronAPI: ElectronAPI

}

export default APIWindowContext;
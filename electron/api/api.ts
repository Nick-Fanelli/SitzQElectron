import { IpcRendererEvent, ipcRenderer } from 'electron';
import MachineSubAPIContext, { MachineAPI } from './machine-api';

// 1. Add API definitions to here
interface ElectronAPI {

    machineAPI: MachineAPI

    addOnWindowClosingListener: (listener: (event: IpcRendererEvent, ...args: any[]) => void) => void
    removeOnWindowClosingListener: (listener: (event: IpcRendererEvent, ...args: any[]) => void) => void

}

// 2. Add bindings here
export const boundElectronAPI : ElectronAPI = {

    machineAPI: MachineSubAPIContext.apiBindings,

    addOnWindowClosingListener: (listener) => { ipcRenderer.on('window-closing', listener); },
    removeOnWindowClosingListener: (listener) => { ipcRenderer.removeListener('window-closing', listener )}
    

}

export const bindAllIPCs = () => {

    MachineSubAPIContext.onBindIPCs();

}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}
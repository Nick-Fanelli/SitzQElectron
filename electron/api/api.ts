import { IpcRendererEvent, ipcRenderer } from 'electron';
import MachineSubAPIContext, { MachineAPI } from './machine-api';
import AppSubAPIContext, { AppAPI } from './app-api';

interface ElectronAPI {

    // 1. Add API definitions to HERE
    machineAPI: MachineAPI
    appAPI: AppAPI

    onWindowClosing: (listener: (event: IpcRendererEvent, ...args: any[]) => void) => () => void

}

export const boundElectronAPI : ElectronAPI = {

    // 2. Add bindings HERE
    machineAPI: MachineSubAPIContext.apiBindings,
    appAPI: AppSubAPIContext.apiBindings,

    onWindowClosing: (listener) => {
        ipcRenderer.on('window-closing', listener);
        return () => { ipcRenderer.removeListener('window-closing', listener); }
    }

}

export const bindAllIPCs = () => {

    // 3. Add call to bind IPCs HERE
    MachineSubAPIContext.onBindIPCs();
    AppSubAPIContext.onBindIPCs();

}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}
import MachineSubAPIContext, { MachineAPI } from './machine-api';

// 1. Add API definitions to here
interface ElectronAPI {

    machineAPI: MachineAPI

}

// 2. Add bindings here
export const boundElectronAPI : ElectronAPI = {

    machineAPI: MachineSubAPIContext.apiBindings

}

export const bindAllIPCs = () => {

    MachineSubAPIContext.onBindIPCs();

}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}
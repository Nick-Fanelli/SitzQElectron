import { MachineAPI, boundMachineAPI } from './machineAPI';

// 1. Add API definitions to here
interface ElectronAPI {

    machineAPI: MachineAPI

}

// 2. Add bindings here
export const boundElectronAPI : ElectronAPI = {

    machineAPI: boundMachineAPI

}

// ====================================================================================
// API Window Context (don't change)
// ====================================================================================
interface APIWindowContext extends Window {

    electronAPI: ElectronAPI

}

export default APIWindowContext;
import os from 'os';
import machineID from 'node-machine-id';

export interface MachineAPI {

    osVersion: string
    homeDir: string
    arch: string
    machineID: string

}

export const boundMachineAPI: MachineAPI = {

    osVersion: os.version(),
    homeDir: os.homedir(),
    arch: os.arch(),
    machineID: machineID.machineIdSync(false) // ensure machineID encryption

}
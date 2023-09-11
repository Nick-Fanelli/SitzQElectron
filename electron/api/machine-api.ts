import os from 'os';
import machineID from 'node-machine-id';
import fs from 'fs/promises'
import path from 'path'

import { BrowserWindow, dialog, ipcMain, ipcRenderer } from 'electron';

import SubAPIContext from './subapi';

export type OsType = 'MacOS' | 'Windows' | 'Linux' | 'Other';

export interface MachineAPI {

    // Variables
    osVersion: string
    homeDir: string
    arch: string
    machineID: string

    // Functions
    mkdir: (filepath: string) => Promise<void>
    touch: (filepath: string) => Promise<void>
    writeFile: (filepath: string, fileContents: string) => Promise<void>
    readFile: (filepath: string) => Promise<string>
    createDirectory: () => Promise<any>
    osType: () => OsType

    pathJoin: (...paths: string[]) => string
    pathBasename: (path: string) => string

}

const mkdir = async (filepath: string): Promise<void> => {

    const absolutePath = path.resolve(filepath);

    try {
        const dirExists = await fs.access(absolutePath).then(() => true).catch(() => false);

        if (!dirExists) {
            await fs.mkdir(absolutePath, { recursive: true, mode: 0o755 });
            console.log("Directory Created Successfully");
        } else {
            console.log("Directory Already Exists");
        }

    } catch (err) {
        console.error(`Error creating directory: ${absolutePath}`, err);
    }

}

const touch = async (filepath: string): Promise<void> => {

    const absolutePath = path.resolve(filepath);

    try {
        const fileExists = await fs.access(absolutePath)
            .then(() => true)
            .catch(() => false);

        if (!fileExists) {
            await fs.writeFile(absolutePath, '');
            console.log("File Created Successfully");
        } else {
            console.log("File Already Exists");
        }
    } catch (err) {
        console.error(`Error creating file: ${absolutePath}`, err);
    }


}

export const writeFile = async (filepath: string, fileContents: string): Promise<void> => {

    const absolutePath = path.resolve(filepath);
    const dirname = path.dirname(absolutePath);

    try {
        await fs.mkdir(dirname, { recursive: true });
        await fs.writeFile(absolutePath, fileContents);
    } catch (err) {
        console.error(`Error writing file: ${absolutePath}`, err);
    }

}

export const readFile = async (filepath: string) : Promise<string> => {

    const absolutePath = path.resolve(filepath);

    return fs.readFile(absolutePath, 'utf-8');

}

const osType = (): OsType => {

    switch(os.type()) {
        
        case 'Darwin':
            return 'MacOS';
        case 'Windows_NT':
            return 'Windows';
        case 'Linux':
            return 'Linux';
        default:
            return 'Other';

    }

}

// ========================================================================================================================================
// IPC Bindings
// ========================================================================================================================================

const onBindIPCs = () => {

    ipcMain.handle('machine-open-directory', async (e) => {

        const activeWindow = BrowserWindow.fromWebContents(e.sender)!;

        try {
            const result = await dialog.showOpenDialog(activeWindow, {
                properties: ['openDirectory', 'createDirectory']
            });

            if (!result.canceled && result.filePaths.length > 0) {

                const selectedDirectory = result.filePaths[0];

                return selectedDirectory;

            }
        } catch (error) {
            console.error("Error while opening directory dialog: ", error);
        }

        return null;
    });

}

// ========================================================================================================================================
// Bound API
// ========================================================================================================================================
const boundMachineAPI: MachineAPI = {

    osVersion: os.version(),
    homeDir: os.homedir(),
    arch: os.arch(),
    machineID: machineID.machineIdSync(false), // ensure machineID encryption
    
    mkdir,
    touch,
    writeFile,
    readFile,
    createDirectory: () => ipcRenderer.invoke('machine-open-directory'),
    osType,

    pathJoin: (...filepaths: string[]) => path.join(...filepaths),
    pathBasename: (filepath: string) => path.basename(filepath)

}

const MachineSubAPIContext: SubAPIContext<MachineAPI> = {

    apiBindings: boundMachineAPI,

    onBindIPCs

}

export default MachineSubAPIContext;

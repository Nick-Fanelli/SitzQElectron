import { Cue } from './Cue'

import { FilepathUtils } from '../Utils/Utils'

interface Project {

    projectName: string,

    cueList: Cue[] | null,

}

export namespace ProjectUtils {

    export const projectToJSON = (project: Readonly<Project>) : string => {
        return JSON.stringify(project);
    }

    export const jsonToProject = (json: Readonly<string>) : Project => {
        return JSON.parse(json);
    }

    export const loadProjectFromShowFile = async (filepath: string) : Promise<Project> => {

        const showFileContents = await window.electronAPI.machineAPI.readFile(filepath);

        return jsonToProject(showFileContents);
        
    }

    export const reconstructProject = (projectName: string, cueList: Cue[] | null) : Project => {

        const reconstructedProject: Project = {
            projectName,
            cueList
        }

        return reconstructedProject;

    }

    export const saveProjectToShowFile = async (filepath: string, project: Readonly<Project>) : Promise<void> => {

        const fileContents = ProjectUtils.projectToJSON(project);
        return window.electronAPI.machineAPI.writeFile(filepath, fileContents);

    }

    export const createProjectFromDirectory = async (directoryPath: string) : Promise<string> => {

        const showName = FilepathUtils.getBasename(directoryPath);

        console.log(directoryPath);

        const resourceDirectory = window.electronAPI.machineAPI.pathJoin(directoryPath, "Resources");
        const showFilePath = window.electronAPI.machineAPI.pathJoin(directoryPath, showName + ".sqshow");

        const showFile: Project = {

            projectName: showName,
            cueList: null

        }

        await window.electronAPI.machineAPI.mkdir(resourceDirectory);
        await saveProjectToShowFile(showFilePath, showFile);

        return showFilePath;
    }

}

export default Project; 
import { Cue } from './Cue'

import { MachineAPI } from '../../electron/api/machine-api'
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

    export const loadProjectFromShowFile = async (machineAPI: MachineAPI, filepath: string) : Promise<Project> => {

        const showFileContents = await machineAPI.readFile(filepath);

        return jsonToProject(showFileContents);
        
    }

    export const createProjectFromDirectory = (machineAPI: MachineAPI, directoryPath: string) => {

        const showName = FilepathUtils.getBasename(directoryPath);

        const resourceDirectory = directoryPath + "/" + "Resources";
        const showFilePath = directoryPath + "/" + showName + ".sqshow";

        const showFile: Project = {

            projectName: showName,
            cueList: null

        }

        machineAPI.mkdir(resourceDirectory);
        machineAPI.writeFile(showFilePath, ProjectUtils.projectToJSON(showFile));
    }

}

export default Project; 
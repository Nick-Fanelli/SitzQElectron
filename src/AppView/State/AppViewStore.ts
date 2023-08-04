import { create } from 'zustand'

import { Cue, CueList, UUID } from '../../Core/Cue'

interface ProjectState {

    projectName: string
    setProjectName: (projectName: string) => void

    cueList: Cue[]
    setCueList: (cues: Cue[]) => void
    createCue: <CueType extends Cue>(cueType: { new (uuid: UUID): CueType }) => void
    updateCueByUUID: (uuid: UUID, updater: (prevCue: Cue) => Cue) => void

}

export const useProjectStore = create<ProjectState>((set) => ({
    
    projectName: "",
    setProjectName: (projectName: string) => set({ projectName }),

    cueList: [],
    setCueList: (cues: Cue[]) => set({ cueList: cues }),
    createCue: (cueType) => { set((state) => ({ cueList: CueList.createNewCue(state.cueList, cueType) })) },

    updateCueByUUID: (uuid, updater) => {

        set((state) => {

            const updatedCueList = [...state.cueList];
            const index = CueList.getIndexByUUID(updatedCueList, uuid);

            if(index >= 0) {
                updatedCueList[index] = updater(updatedCueList[index]);
            } else {
                console.error("Could not find cue with UUID of: ", uuid);
            }

            return { cueList: updatedCueList }

        })

    }

}));
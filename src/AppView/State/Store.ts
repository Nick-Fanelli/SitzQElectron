import { create } from 'zustand'

interface ProjectState {

    projectName: string
    setProjectName: (projectName: string) => void

}

export const useProjectStore = create<ProjectState>((set) => ({
    
    projectName: "",
    setProjectName: (projectName: string) => set({ projectName })

}));
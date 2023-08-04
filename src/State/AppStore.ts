import { create } from "zustand"

interface AppViewState {

    activeProject: string | null,
    setActiveProject: (showFilepath: string | null) => void

}

export const useAppStore = create<AppViewState>((set) => ({

    activeProject: null,
    setActiveProject: (showFilepath: string | null) => set({ activeProject: showFilepath })
        
}));
import { create } from "zustand"

interface AppViewState {

    isCacheLoaded: boolean,
    setIsCacheLoaded: (value: boolean) => void

    activeProject: string | null,
    setActiveProject: (showFilepath: string | null) => void

}

export const useAppStore = create<AppViewState>((set) => ({

    isCacheLoaded: false,
    setIsCacheLoaded: (value: boolean) => set({ isCacheLoaded: value }),

    activeProject: null,
    setActiveProject: (showFilepath: string | null) => set({ activeProject: showFilepath })
        
}));
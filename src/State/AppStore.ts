import { create } from "zustand"

interface AppConstantsState {

    isCacheLoaded: boolean,
    setIsCacheLoaded: (value: boolean) => void

}

export const useAppConstantsStore = create<AppConstantsState>((set) => ({

    isCacheLoaded: false,
    setIsCacheLoaded: (value: boolean) => set({ isCacheLoaded: value }),
        
}));
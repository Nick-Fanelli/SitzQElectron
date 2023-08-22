import { create } from "zustand"

interface TransferData<DataType> {

    id: string
    dataType: DataType

}

interface DragDropState {

    transferData: TransferData<any> | null

    setTransferData: <DataType> (id: string, dataType: DataType) => void

}

export const useDragDropStore = create<DragDropState>(set => ({

    transferData: null,
    setTransferData: <DataType> (id: string, dataType: DataType) => set({ transferData: { id, dataType } }),

}))
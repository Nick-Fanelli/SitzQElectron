import { ReactNode, useState } from "react"

export type DropTargetProvided = {

    onDragOver: (event: React.DragEvent<HTMLElement>) => void
    onDragLeave: (event: React.DragEvent<HTMLElement>) => void

}

export type DropTargetSnapshot = {

    isDraggedOver: boolean
    
}

type Props = {

    children: (provided: DropTargetProvided, snapshot: DropTargetSnapshot) => ReactNode

}

const DropTarget = (props: Props) => {

    const [ snapshot, setSnapshot ] = useState<DropTargetSnapshot>({
        isDraggedOver: false
    });

    const provided: DropTargetProvided = {

        onDragOver: () => {

            if(!snapshot.isDraggedOver) {
                setSnapshot((prev) => ({
                    ...prev,
                    isDraggedOver: true
                }))
            }

        },

        onDragLeave: () => {

            setSnapshot((prev) => ({
                ...prev,
                isDraggedOver: false
            }))

        }


    }

    return props.children(provided, snapshot);

}

export default DropTarget;
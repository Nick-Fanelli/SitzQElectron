import { ReactNode, useCallback, useState } from "react"

export type DropTargetProvided = {

    onDragOver: (event: React.DragEvent<HTMLElement>) => void
    onDragLeave: (event: React.DragEvent<HTMLElement>) => void
    onDrop: (event: React.DragEvent<HTMLElement>) => void

}

export type DropTargetSnapshot = {

    isDraggedOver: boolean
    
}

type Props = {

    children: (provided: DropTargetProvided, snapshot: DropTargetSnapshot) => ReactNode
    acceptOnly?: [string]
    onDrop?: (dropID: string, dropData: any) => void
    ruleOnValidationString?: (validationString: string) => boolean

}

const DropTarget = (props: Props) => {

    const [ snapshot, setSnapshot ] = useState<DropTargetSnapshot>({
        isDraggedOver: false
    });

    const shouldAccept = (dropID: string, validationString: string | undefined) => {

        if(props.acceptOnly === undefined || props.acceptOnly.includes(dropID)) {

            if(props.ruleOnValidationString && validationString !== undefined) {
                return props.ruleOnValidationString(validationString);
            } else {
                return true;
            }

        }

        return false;

    }

    const provided: DropTargetProvided = {

        onDragOver: (event) => {

            event.stopPropagation();
            event.preventDefault();

            const transferType = event.dataTransfer.types.at(0);

            if(transferType !== undefined) {
                const validationString = event.dataTransfer.types.at(1);

                const isAcceptable = shouldAccept(transferType, validationString);

                if(isAcceptable) {
                    if(!snapshot.isDraggedOver) {
                        setSnapshot((prev) => ({
                            ...prev,
                            isDraggedOver: true
                        }))
                    }
                }
            }

        },

        onDragLeave: () => {

            setSnapshot((prev) => ({
                ...prev,
                isDraggedOver: false
            }))

        },

        onDrop: (event) => {

            event.preventDefault();

            const transferType = event.dataTransfer.types.at(1); // flip

            if(!transferType)
                return;

            const validationString = event.dataTransfer.types.at(0);

            if(!shouldAccept(transferType, validationString))
                return;

            setSnapshot((prev) => ({
                ...prev,
                isDraggedOver: false
            }))


            if(transferType) {
                const dataTransfer = JSON.parse(event.dataTransfer.getData(transferType));
                event.dataTransfer.clearData();

                if(props.onDrop)
                    props.onDrop(transferType, dataTransfer);
            }

        }

    }

    return props.children(provided, snapshot);

}

export default DropTarget;
import { ReactNode, useState } from "react"

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

    const decipherTransferKey = (transferKey: string): { dropID: string, validationString: string | null } | null => {

        const parts = transferKey.split(':');

        if(parts.length !== 2) {
            console.error(`Transfer Key of '${transferKey}' is invalid`)
            return null;
        }

        let dropID: string = parts[0];
        let validationString: string | null = parts[1];

        if(validationString.length === 0)
            validationString = null;
        
        return { dropID, validationString };

    }

    const shouldAccept = (transferKey: string) => {

        const keys = decipherTransferKey(transferKey);

        if(keys === null)
            return false;

        if(props.acceptOnly === undefined || props.acceptOnly.includes(keys.dropID)) {

            if(props.ruleOnValidationString && keys.validationString !== null) {
                return props.ruleOnValidationString(keys.validationString);
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

            const transferKey = event.dataTransfer.types.at(0);

            if(transferKey !== undefined) {

                const isAcceptable = shouldAccept(transferKey);

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

            const transferKey = event.dataTransfer.types.at(0);

            if(!transferKey || !shouldAccept(transferKey))
                return;

            setSnapshot((prev) => ({
                ...prev,
                isDraggedOver: false
            }))


            if(transferKey) {
                const dataTransfer = JSON.parse(event.dataTransfer.getData(transferKey));
                event.dataTransfer.clearData();

                if(props.onDrop)
                    props.onDrop(transferKey.split(":")[0], dataTransfer);
            }

        }

    }

    return props.children(provided, snapshot);

}

export default DropTarget;
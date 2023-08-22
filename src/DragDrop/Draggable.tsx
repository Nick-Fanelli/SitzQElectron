import React, { ReactNode, useRef, useState } from "react"

export type DraggableProvided = {

    draggable: boolean
    onDragStart: (event: React.DragEvent<HTMLElement>) => void
    onDragEnd: (event: React.DragEvent<HTMLElement>) => void

}

export type DraggableSnapshot = {

    isBeingDragged: boolean

}

type Props = {

    children: (provided: DraggableProvided, snapshot: DraggableSnapshot) => ReactNode
    isDraggable?: boolean

    dragID: string
    validationString?: string

    dropData?: any

    customCreateDraggableElement?: () => Element
    onDragStart?: () => void
    onDragEnd?: () => void

}

const Draggable = (props: Props) => {

    const [ snapshot, setSnapshot ] = useState<DraggableSnapshot>({
        isBeingDragged: false
    });

    const draggablePreviewRef = useRef<Element | null>(null);

    const createDraggableElement = () => {
        
        if(props.customCreateDraggableElement) {
            draggablePreviewRef.current = props.customCreateDraggableElement();
            document.body.appendChild(draggablePreviewRef.current);
        }

    }

    const destroyDraggableElement = () => {

        if(draggablePreviewRef.current) {
            draggablePreviewRef.current.remove();
            draggablePreviewRef.current = null;
        }

    }

    const provided: DraggableProvided = {

        draggable: props.isDraggable === undefined ? true : props.isDraggable,

        onDragStart: (event) => {

            createDraggableElement();

            if(draggablePreviewRef.current) {
                event.dataTransfer.setDragImage(
                    draggablePreviewRef.current, 0, 0
                );
            }

            event.dataTransfer.setData(props.dragID, JSON.stringify(props.dropData)); // Transfer Index 0

            if(props.validationString) {
                event.dataTransfer.setData(props.validationString, ""); // Transfer Index 1
            }

            setSnapshot((prev) => ({
                ...prev,
                isBeingDragged: true
            }));

            if(props.onDragStart)
                props.onDragStart();
        },

        onDragEnd: () => {

            destroyDraggableElement();

            setSnapshot((prev) => ({
                ...prev,
                isBeingDragged: false
            }));

            if(props.onDragEnd)
                props.onDragEnd();
        }

    }


    return props.children(provided, snapshot);
}

export default Draggable;
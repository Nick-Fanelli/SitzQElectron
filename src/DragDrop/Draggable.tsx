import React, { ReactElement } from "react"
import { ReactNode, useEffect, useRef } from "react"

export type DraggableProvided = {

    draggable: boolean
    onDragStart: (event: React.DragEvent<HTMLElement>) => void
    onDragEnd: (event: React.DragEvent<HTMLElement>) => void

}

type Props = {

    children: (provided: DraggableProvided) => ReactNode
    isDraggable?: boolean
    customCreateDraggableElement?: () => Element

}

const Draggable = ({ children, isDraggable = true, customCreateDraggableElement }: Props) => {

    const draggablePreviewRef = useRef<Element | null>(null);

    const createDraggableElement = () => {
        
        if(customCreateDraggableElement) {
            draggablePreviewRef.current = customCreateDraggableElement();
            document.body.appendChild(draggablePreviewRef.current);
        }

    }

    const destroyDraggableElement = () => {

        if(draggablePreviewRef.current)
            document.body.removeChild(draggablePreviewRef.current);

    }

    const provided: DraggableProvided = {

        draggable: isDraggable,

        onDragStart: (event) => {
            createDraggableElement();

            if(draggablePreviewRef.current) {
                event.dataTransfer.setDragImage(
                    draggablePreviewRef.current, 0, 0
                );
            }
        },

        onDragEnd: () => {
            destroyDraggableElement();
        },

    }

    return children(provided);
}

export default Draggable;
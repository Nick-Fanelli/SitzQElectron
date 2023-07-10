import React, { useCallback, useRef } from 'react'

import './Dockspace.css'
import { Transform } from '../../Utils/Math';
import { WindowHeaderSize } from './Window';

const DOCKING_TRIGGER_MARGIN: number = 200; // px

type Props = {
    children: JSX.Element[] | JSX.Element
}

enum DockingArea {
    NONE,
    LEFT,
    TOP,
    BOTTOM,
    RIGHT
}

const Dockspace = (props: Props) => {

    const childElements = Array.isArray(props.children) ? props.children : [props.children];

    const dockspaceRef = useRef<HTMLDivElement>(null);

    const topDockingHighlightRef = useRef<HTMLDivElement>(null);
    const bottomDockingHighlightRef = useRef<HTMLDivElement>(null);
    const leftDockingHighlightRef = useRef<HTMLDivElement>(null);
    const rightDockingHighlightRef = useRef<HTMLDivElement>(null);

    const tempDockingAreaRef = useRef<DockingArea>(DockingArea.NONE);

    const onWindowMoveCallback = useCallback((mouseX: number, mouseY: number) => {

        if(dockspaceRef.current) {

            if(mouseX < DOCKING_TRIGGER_MARGIN) { // Left Dock

                leftDockingHighlightRef.current?.classList.remove("hidden");
                tempDockingAreaRef.current = DockingArea.LEFT;

            } else if(mouseX > window.innerWidth - DOCKING_TRIGGER_MARGIN) { // Right Dock

                rightDockingHighlightRef.current?.classList.remove("hidden");
                tempDockingAreaRef.current = DockingArea.RIGHT;

            } else if(mouseY < DOCKING_TRIGGER_MARGIN) { // Top Dock

                topDockingHighlightRef.current?.classList.remove("hidden");
                tempDockingAreaRef.current = DockingArea.TOP;

            } else if(mouseY > window.innerHeight - DOCKING_TRIGGER_MARGIN) { // Bottom Dock

                bottomDockingHighlightRef.current?.classList.remove("hidden");
                tempDockingAreaRef.current = DockingArea.BOTTOM;

            } else if(tempDockingAreaRef.current !== DockingArea.NONE) { // Just Moved Outside of Dock Area

                topDockingHighlightRef.current?.classList.add("hidden");
                leftDockingHighlightRef.current?.classList.add("hidden");
                rightDockingHighlightRef.current?.classList.add("hidden");
                bottomDockingHighlightRef.current?.classList.add("hidden");

                tempDockingAreaRef.current = DockingArea.NONE;

            }

        }

    }, [dockspaceRef.current?.style, topDockingHighlightRef, leftDockingHighlightRef, bottomDockingHighlightRef, rightDockingHighlightRef, tempDockingAreaRef]);

    // Resolve Window Move
    const onResolveMoveCallback = useCallback((setTransform: Function) => {

        if(tempDockingAreaRef.current !== DockingArea.NONE) {

            // Remove the dock highlights
            topDockingHighlightRef.current?.classList.add("hidden");
            leftDockingHighlightRef.current?.classList.add("hidden");
            rightDockingHighlightRef.current?.classList.add("hidden");
            bottomDockingHighlightRef.current?.classList.add("hidden");

            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            switch(tempDockingAreaRef.current) {

            case DockingArea.LEFT:
                setTransform((prev: Transform) => ({
                    ...prev,
                    position: {
                        ...prev.position,
                        x: 0,
                        y: 0
                    },
                    scale: {
                        ...prev.scale,
                        width: windowWidth / 2,
                        height: windowHeight - WindowHeaderSize
                    }
                  }));
                break;
            case DockingArea.RIGHT:
                setTransform((prev: Transform) => ({
                    ...prev,
                    position: {
                        ...prev.position,
                        x: windowWidth - prev.scale.width - (windowWidth / 2 - prev.scale.width),
                        y: 0
                    },
                    scale: {
                        ...prev.scale,
                        width: windowWidth / 2,
                        height: windowHeight - WindowHeaderSize
                    }
                  }));
                break;
            case DockingArea.BOTTOM:
                setTransform((prev: Transform) => ({
                    ...prev,
                    position: {
                        ...prev.position,
                        x: 0,
                        y: windowHeight - prev.scale.height - (windowHeight / 2 - prev.scale.height)
                    },
                    scale: {
                        ...prev.scale,
                        width: windowWidth,
                        height: windowHeight / 2 - WindowHeaderSize
                    }
                  }));
                break;
            case DockingArea.TOP:
                setTransform((prev: Transform) => ({
                    ...prev,
                    position: {
                        ...prev.position,
                        x: 0,
                        y: 0
                    },
                    scale: {
                        ...prev.scale,
                        width: windowWidth,
                        height: windowHeight / 2 - WindowHeaderSize
                    }
                  }));
                break;
            default:
                break;

            }

            tempDockingAreaRef.current = DockingArea.NONE;

        }

    }, [topDockingHighlightRef, leftDockingHighlightRef, bottomDockingHighlightRef, rightDockingHighlightRef, tempDockingAreaRef]);

    return (
        <div ref={dockspaceRef} id="dockspace">
            {  
                childElements.map((child, index) => {
                    return React.cloneElement(child, { key: index, onWindowMoveCallback, onResolveMoveCallback });
                })
            }

            <div ref={topDockingHighlightRef} className="docking-highlight top hidden"></div>
            <div ref={leftDockingHighlightRef} className="docking-highlight left hidden"></div>
            <div ref={bottomDockingHighlightRef} className="docking-highlight bottom hidden"></div>
            <div ref={rightDockingHighlightRef} className="docking-highlight right hidden"></div>
        </div>
    );

}

export default Dockspace;
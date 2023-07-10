import { useEffect, useRef, useState } from 'react';
import { Transform } from '../../Utils/Math';

import './Window.css'

export const WindowHeaderSize = 23;

export type WindowPreferences = {
    minimumWidth?: number,
    minimumHeight?: number
}

const defaultWindowPreferences: WindowPreferences = {
    minimumWidth: 15,
    minimumHeight: 15
}

type Props = {
    title?: string
    windowPreferences?: WindowPreferences
    onWindowMoveCallback?: Function
    onResolveMoveCallback?: Function
    children?: JSX.Element | JSX.Element[]
}

const Window = (props: Props) => {

    const [ preferences, setPreferences ] = useState<WindowPreferences>(defaultWindowPreferences);

    useEffect(() => {

        setPreferences((prev: WindowPreferences) => ({
            ...prev,
            ...props.windowPreferences
        }));

    }, [props.windowPreferences, setPreferences]);

    const [ transform, setTransform ] = useState<Transform>({ position: { x: 200, y: 200 }, scale: { width: 100, height: 100}});

    // Resizable Refs
    const resizableWindowRef = useRef<HTMLDivElement>(null);

    const resizerHeaderTopRef = useRef<HTMLDivElement>(null);
    const resizerTopRef = useRef<HTMLDivElement>(null);
    const resizerBottomRef = useRef<HTMLDivElement>(null);
    const resizerLeftRef = useRef<HTMLDivElement>(null);
    const resizerRightRef = useRef<HTMLDivElement>(null);
    const resizeCornerHandleRef = useRef<HTMLDivElement>(null);

    const windowMoveIgnoreElements = [ resizerHeaderTopRef, resizerTopRef, resizerBottomRef, resizerLeftRef, resizerRightRef, resizeCornerHandleRef ];

    // Update Position of Window
    useEffect(() => {

        if(resizableWindowRef.current) {

            transform.scale.width = Math.max(transform.scale.width, preferences.minimumWidth || transform.scale.width);
            transform.scale.height = Math.max(transform.scale.height, preferences.minimumHeight || transform.scale.height);

            transform.position.x = Math.max(transform.position.x, 0);
            transform.position.y = Math.max(transform.position.y, 0);

            transform.position.x = Math.min(transform.position.x, window.innerWidth - transform.scale.width);
            transform.position.y = Math.min(transform.position.y, window.innerHeight - transform.scale.height);

            resizableWindowRef.current.style.left = `${transform!.position!.x}px`;
            resizableWindowRef.current.style.top = `${transform!.position!.y + 20}px`;
            resizableWindowRef.current.style.width = `${transform!.scale!.width}px`;
            resizableWindowRef.current.style.height = `${transform!.scale!.height}px`;

        }

    }, [transform, preferences]);

    // Window Manual Movement
    useEffect(() => {

        // Temporary Variables
        let offsetX = 0;
        let offsetY = 0;

        let prevScale = 0; // Temporary Variable

        // ====================================================================================================================
        // Window Move
        // ====================================================================================================================

        const onResizableWindowMouseMove = (e: MouseEvent) => {

            setTransform((prev: Transform) => ({
                ...prev,
                position: {
                    ...prev.position,
                    x: e.clientX - offsetX,
                    y: e.clientY - offsetY,
                }
            }));

            props.onWindowMoveCallback!(e.clientX, e.clientY);
        }

        const onResizableWindowMouseUp = () => {
            document.removeEventListener("mousemove", onResizableWindowMouseMove);
            document.removeEventListener("mouseup", onResizableWindowMouseUp);

            props.onResolveMoveCallback!(setTransform);
        }

        const onResizableWindowMouseDown = (e: MouseEvent) => {

            // Ignore the window move ignore elements(ex. the scale borders)
            if(windowMoveIgnoreElements.some((element) => element.current!.contains(e.target as Node))) {
                return;
            }

            offsetX = e.clientX - transform.position.x;
            offsetY = e.clientY - transform.position.y;

            document.addEventListener("mousemove", onResizableWindowMouseMove);
            document.addEventListener("mouseup", onResizableWindowMouseUp);
        }

        // ====================================================================================================================
        // Right Resizer
        // ====================================================================================================================

        const onResizerRightMouseMove = (e: MouseEvent) => {
            let deltaScale = e.clientX - offsetX;

            setTransform((prev) => ({
                ...prev,
                scale: {
                    ...prev.scale,
                    width: prev.scale.width + deltaScale
                }
            }));

            offsetX = e.clientX;
        }

        const onResizerRightMouseUp = () => {
            document.removeEventListener("mousemove", onResizerRightMouseMove);
            document.removeEventListener("mouseup", onResizerRightMouseUp);
        }

        const onResizerRightMouseDown = (e: MouseEvent) => {
            offsetX = e.clientX;

            document.addEventListener("mousemove", onResizerRightMouseMove);
            document.addEventListener("mouseup", onResizerRightMouseUp);
        }

        // ====================================================================================================================
        // Bottom Resizer
        // ====================================================================================================================

        const onResizerBottomMouseMove = (e: MouseEvent) => {
            let deltaScale = e.clientY - offsetY;

            setTransform((prev) => ({
                ...prev,
                scale: {
                    ...prev.scale,
                    height: prev.scale.height + deltaScale
                }
            }));

            offsetY = e.clientY;
        }

        const onResizerBottomMouseUp = () => {
            document.removeEventListener("mousemove", onResizerBottomMouseMove);
            document.removeEventListener("mouseup", onResizerBottomMouseUp);
        }

        const onResizerBottomMouseDown = (e: MouseEvent) => {
            offsetY = e.clientY;

            document.addEventListener("mousemove", onResizerBottomMouseMove);
            document.addEventListener("mouseup", onResizerBottomMouseUp);
        }

        // ====================================================================================================================
        // Top Resizer
        // ====================================================================================================================

        const onResizerTopMouseMove = (e: MouseEvent) => {

            setTransform((prev: Transform) => ({
                ...prev,
                position: {
                    ...prev.position,
                    y: e.clientY - (offsetY - transform.position.y)
                },
                scale: {
                    ...prev.scale,
                    height: prevScale - (e.clientY - offsetY)
                }
            }));

        }

        const onResizerTopMouseUp = () => {
            document.removeEventListener("mousemove", onResizerTopMouseMove);
            document.removeEventListener("mouseup", onResizerTopMouseUp);
        }

        const onResizerTopMouseDown = (e: MouseEvent) => {
            offsetY = e.clientY;
            prevScale = transform.scale.height;

            document.addEventListener("mousemove", onResizerTopMouseMove);
            document.addEventListener("mouseup", onResizerTopMouseUp);
        }

        // ====================================================================================================================
        // Left Resizer
        // ====================================================================================================================

        const onResizerLeftMouseMove = (e: MouseEvent) => {

            setTransform((prev: Transform) => ({
                ...prev,
                position: {
                    ...prev.position,
                    x: e.clientX - (offsetX - transform.position.x)
                },
                scale: {
                    ...prev.scale,
                    width: prevScale - (e.clientX - offsetX)
                }
            }));

        }

        const onResizerLeftMouseUp = () => {
            document.removeEventListener("mousemove", onResizerLeftMouseMove);
            document.removeEventListener("mouseup", onResizerLeftMouseUp);
        }

        const onResizerLeftMouseDown = (e: MouseEvent) => {
            offsetX = e.clientX;
            prevScale = transform.scale.width;

            document.addEventListener("mousemove", onResizerLeftMouseMove);
            document.addEventListener("mouseup", onResizerLeftMouseUp);
        }

        // ====================================================================================================================
        // Corner Resizer
        // ====================================================================================================================

        const onResizeCornerMouseMove = (e: MouseEvent) => {

            let deltaX = e.clientX - offsetX;
            let deltaY = e.clientY - offsetY;

            setTransform((prev) => ({
                ...prev,
                scale: {
                    ...prev.scale,
                    width: prev.scale.width + deltaX,
                    height: prev.scale.height + deltaY
                }
            }));

            offsetX = e.clientX;
            offsetY = e.clientY;
        }

        const onResizeCornerMouseUp = () => {
            document.removeEventListener("mousemove", onResizeCornerMouseMove);
            document.removeEventListener("mouseup", onResizeCornerMouseUp);
        }

        const onResizeCornerMouseDown = (e: MouseEvent) => {
            offsetX = e.clientX;
            offsetY = e.clientY;

            document.addEventListener("mousemove", onResizeCornerMouseMove);
            document.addEventListener("mouseup", onResizeCornerMouseUp);
        }

        // ====================================================================================================================
        // Mouse Down Event Listeners
        // ====================================================================================================================
        resizableWindowRef?.current?.addEventListener("mousedown", onResizableWindowMouseDown);
        resizerRightRef?.current?.addEventListener("mousedown", onResizerRightMouseDown);
        resizerBottomRef?.current?.addEventListener("mousedown", onResizerBottomMouseDown);
        resizerTopRef?.current?.addEventListener("mousedown", onResizerTopMouseDown);
        resizerHeaderTopRef?.current?.addEventListener("mousedown", onResizerTopMouseDown);
        resizerLeftRef?.current?.addEventListener("mousedown", onResizerLeftMouseDown);
        resizeCornerHandleRef?.current?.addEventListener("mousedown", onResizeCornerMouseDown);

        return () => {
            resizableWindowRef?.current?.removeEventListener("mousedown", onResizableWindowMouseDown);
            resizerRightRef?.current?.removeEventListener("mousedown", onResizerRightMouseDown);
            resizerBottomRef?.current?.removeEventListener("mousedown", onResizerBottomMouseDown);
            resizerTopRef?.current?.removeEventListener("mousedown", onResizerTopMouseDown);
            resizerHeaderTopRef?.current?.removeEventListener("mousedown", onResizerTopMouseDown);
            resizerLeftRef?.current?.removeEventListener("mousedown", onResizerLeftMouseDown);
            resizeCornerHandleRef?.current?.removeEventListener("mousedown", onResizeCornerMouseDown);
        }
    }, [transform, setTransform, props.onWindowMoveCallback, props.onResolveMoveCallback]);

    return (
        <>
        <button onClick={() => {
            setTransform((prev: Transform) => ({
                ...prev,
                position: {
                  x: 200,
                  y: 200
                },
                scale: {
                    width: 100,
                    height: 100
                }
              }));
        }}>Reset Window</button>
        <div ref={resizableWindowRef} className="resizable-window">

            <div className="header">
                <p>{props.title}</p>
            </div>

            <div ref={resizerHeaderTopRef} className="resizer resizer-header-top"></div>
            <div ref={resizerTopRef} className="resizer resizer-top"></div>
            <div ref={resizerBottomRef} className="resizer resizer-bottom"></div>
            <div ref={resizerLeftRef} className="resizer resizer-left"></div>
            <div ref={resizerRightRef} className="resizer resizer-right"></div>
            <div ref={resizeCornerHandleRef} className="corner-handle"></div>

            <div className="children-wrapper">
                {props.children}
            </div>

        </div>
        </>
    )

}

export default Window;
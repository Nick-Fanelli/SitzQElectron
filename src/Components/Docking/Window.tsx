import { useEffect, useRef, useState } from 'react';
import './Window.css'

type Transform = {
    position: {
        x: number,
        y: number
    },
    scale: {
        width: number,
        height: number
    }
}

type Props = {
    title?: string
    children?: JSX.Element | JSX.Element[]
}

const Window = (props: Props) => {

    const [transform, setTransform] = useState<Transform>({ position: { x: 200, y: 200 }, scale: { width: 100, height: 100}});

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

            resizableWindowRef.current.style.left = `${transform!.position!.x}px`;
            resizableWindowRef.current.style.top = `${transform!.position!.y + 20}px`;
            resizableWindowRef.current.style.width = `${transform!.scale!.width}px`;
            resizableWindowRef.current.style.height = `${transform!.scale!.height}px`;

        }

    }, [transform]);

    // Window Manual Movement
    useEffect(() => {

        let offsetX = 0;
        let offsetY = 0;

        let prevScale = 0;

        // Window Move
        const onResizableWindowMouseMove = (e: MouseEvent) => {

            setTransform((prev: Transform) => ({
                ...prev,
                position: {
                    ...prev.position,
                    x: e.clientX - offsetX,
                    y: e.clientY - offsetY,
                }
            }));

        }

        const onResizableWindowMouseUp = () => {
            document.removeEventListener("mousemove", onResizableWindowMouseMove);
            document.removeEventListener("mouseup", onResizableWindowMouseUp);
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

        // Right Resizer
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

        // Bottom Resizer
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

        // Top Resizer
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

        // Left Resizer
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

        // Corner Resizer
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
    }, [transform, setTransform]);

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
        }}>Hello World</button>
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

            {/* <div className="children-wrapper">
                {props.children}
            </div> */}

        </div>
        </>
    )

}

export default Window;
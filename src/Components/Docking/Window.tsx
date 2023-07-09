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

    const [transform, setTransform] = useState<Transform>({ position: { x: 0, y: 0 }, scale: { width: 100, height: 100}});

    // Resizable Refs
    const resizableWindowRef = useRef<HTMLDivElement>(null);

    const resizerTopRef = useRef<HTMLDivElement>(null);
    const resizerBottomRef = useRef<HTMLDivElement>(null);
    const resizerLeftRef = useRef<HTMLDivElement>(null);
    const resizerRightRef = useRef<HTMLDivElement>(null);

    const windowMoveIgnoreElements = [ resizerTopRef, resizerBottomRef, resizerLeftRef, resizerRightRef ];

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

        resizableWindowRef?.current?.addEventListener("mousedown", onResizableWindowMouseDown);

        return () => {
            resizableWindowRef?.current?.removeEventListener("mousedown", onResizableWindowMouseDown);
        }
    }, [transform, setTransform]);


    // useEffect(() => {

    //     const resizableElement = resizableWindowRef.current;
    //     const styles = window.getComputedStyle(resizableElement!);

    //     let width = parseInt(styles.width, 10);
    //     let height = parseInt(styles.height, 10);

    //     let x = 50;
    //     let y = 50;

    //     // Position
    //     resizableElement!.style.top = "50px";
    //     resizableElement!.style.left = "50px";

    //     // Right Resize
    //     const onMouseMoveRightResize = (event: { clientX: number }) => {
    //         const dx = event.clientX - x;
    //         x = event.clientX;
    //         width = width + dx;
    //         resizableElement!.style.width = `${width}px`;
    //     }

    //     const onMouseUpRightResize = () => {
    //         document.removeEventListener("mousemove", onMouseMoveRightResize);
    //     }

    //     const onMouseDownRightResize = (event: { clientX: number }) => {
    //         x = event.clientX;
    //         resizableElement!.style.left = styles.left;
    //         resizableElement!.style.right = "";

    //         document.addEventListener("mousemove", onMouseMoveRightResize);
    //         document.addEventListener("mouseup", onMouseUpRightResize);
    //     }


    //     // Top resize
    //     const onMouseMoveTopResize = (event: { clientY: number }) => {
    //         const dy = event.clientY - y;
    //         height = height - dy;
    //         y = event.clientY;
    //         resizableElement!.style.height = `${height}px`;
    //     };

    //     const onMouseUpTopResize = (event: { clientX: number }) => {
    //         document.removeEventListener("mousemove", onMouseMoveTopResize);
    //     };

    //     const onMouseDownTopResize = (event: { clientY: number }) => {
    //         y = event.clientY;
    //         const styles = window.getComputedStyle(resizableElement!);
    //         resizableElement!.style.bottom = styles.bottom;
    //         resizableElement!.style.top = "";
    //         document.addEventListener("mousemove", onMouseMoveTopResize);
    //         document.addEventListener("mouseup", onMouseUpTopResize);
    //     };

    //     // Bottom resize
    //     const onMouseMoveBottomResize = (event: { clientY: number }) => {
    //         const dy = event.clientY - y;
    //         height = height + dy;
    //         y = event.clientY;
    //         resizableElement!.style.height = `${height}px`;
    //     };

    //     const onMouseUpBottomResize = (event: { clientX: number }) => {
    //         document.removeEventListener("mousemove", onMouseMoveBottomResize);
    //     };

    //     const onMouseDownBottomResize = (event: { clientY: number }) => {
    //         y = event.clientY;
    //         const styles = window.getComputedStyle(resizableElement!);
    //         resizableElement!.style.top = styles.top;
    //         resizableElement!.style.bottom = "";
    //         document.addEventListener("mousemove", onMouseMoveBottomResize);
    //         document.addEventListener("mouseup", onMouseUpBottomResize);
    //     };

    //     // Left resize
    //     const onMouseMoveLeftResize = (event: { clientX: number }) => {
    //         const dx = event.clientX - x;
    //         x = event.clientX;
    //         width = width - dx;
    //         resizableElement!.style.width = `${width}px`;
    //     };

    //     const onMouseUpLeftResize = (event: { clientX: number }) => {
    //         document.removeEventListener("mousemove", onMouseMoveLeftResize);
    //     };

    //     const onMouseDownLeftResize = (event: { clientX: number }) => {
    //         x = event.clientX;
    //         resizableElement!.style.right = styles.right;
    //         resizableElement!.style.left = "";
    //         document.addEventListener("mousemove", onMouseMoveLeftResize);
    //         document.addEventListener("mouseup", onMouseUpLeftResize);
    //     };

    //     // Add mouse down event listener
    //     const resizerRight = resizerRightRef.current;
    //     resizerRight!.addEventListener("mousedown", onMouseDownRightResize);
    //     const resizerTop = resizerTopRef.current;
    //     resizerTop!.addEventListener("mousedown", onMouseDownTopResize);
    //     const resizerBottom = resizerBottomRef.current;
    //     resizerBottom!.addEventListener("mousedown", onMouseDownBottomResize);
    //     const resizerLeft = resizerLeftRef.current;
    //     resizerLeft!.addEventListener("mousedown", onMouseDownLeftResize);

    //     return () => {
    //         resizerRight!.removeEventListener("mousedown", onMouseDownRightResize);
    //         resizerTop!.removeEventListener("mousedown", onMouseDownTopResize);
    //         resizerBottom!.removeEventListener("mousedown", onMouseDownBottomResize);
    //         resizerLeft!.removeEventListener("mousedown", onMouseDownLeftResize);        
    //     };

    // }, []);


    return (
        <>
        <button onClick={() => {
            setTransform((prev: Transform) => ({
                ...prev,
                position: {
                  x: 0,
                  y: 0
                }
              }));
        }}>Hello World</button>
        <div ref={resizableWindowRef} className="resizable-window">

            <div className="header">
                <p>{props.title}</p>
            </div>

            <div ref={resizerTopRef} className="resizer resizer-top"></div>
            <div ref={resizerBottomRef} className="resizer resizer-bottom"></div>
            <div ref={resizerLeftRef} className="resizer resizer-left"></div>
            <div ref={resizerRightRef} className="resizer resizer-right"></div>

            {/* <div className="children-wrapper">
                {props.children}
            </div> */}

        </div>
        </>
    )

}

export default Window;
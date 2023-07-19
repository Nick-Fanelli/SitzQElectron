import { useEffect, useRef, useState } from 'react';

import './CuePropertiesComponent.css'

const DefaultCuePropertiesHeight : number = 275;

const CuePropertiesComponent = () => {

    const [ cuePropertiesHeight, setCuePropertiesHeight ] = useState<number>(DefaultCuePropertiesHeight);

    const resizeHandleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        let tempY = 0;

        const mouseMoveCallback = (e: MouseEvent) => {
            let deltaY = tempY - e.clientY;

            setCuePropertiesHeight((prev) => prev + deltaY);

            tempY = e.clientY;
        }

        const mouseUpCallback = () => {
            document.removeEventListener('mousemove', mouseMoveCallback);
            document.removeEventListener('mouseup', mouseUpCallback);
        }

        const mouseDownCallback = (e: MouseEvent) => {
            tempY = e.clientY;

            document.addEventListener('mousemove', mouseMoveCallback);
            document.addEventListener('mouseup', mouseUpCallback);
        } 

        resizeHandleRef?.current?.addEventListener('mousedown', mouseDownCallback);

        return () => {
            resizeHandleRef?.current?.removeEventListener('mousedown', mouseDownCallback);
        }

    }, [resizeHandleRef, setCuePropertiesHeight]);

    return (
        <section id="cue-properties" style={{height: `${cuePropertiesHeight}px`, minHeight: `${cuePropertiesHeight}px`}}>

            <div className="resize-handle" ref={resizeHandleRef}>
                <div className="line"></div>
            </div>

            <h1>Cue Properties</h1>
        </section>
    )

}

export default CuePropertiesComponent;
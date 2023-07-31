import React, { ChangeEvent, useCallback, useRef } from 'react'

import './HiddenInputComponent.css'

interface HandleInputComponentProps {

    type?: string

    value: any
    setValue?: (value: string) => void

    shouldLiveUpdate?: boolean

    className?: string

}

const HiddenInputComponent = (props: HandleInputComponentProps) => {

    const ref = useRef<HTMLInputElement>(null);

    const changedValue = useRef<string | null>(null);

    const watchKeyInputForFocus = useCallback((e: KeyboardEvent) => {

        if(e.key === 'Enter') {
            ref?.current?.blur();
        }

    }, [ref.current]);

    const globalMouseDown = useCallback((e: MouseEvent) => {

        if(ref.current && e.target !== ref.current) {
            ref.current.blur();
        }

    }, [ref.current]);

    return (
        <input ref={ref} className={`hidden-input ${props.className}`} type={props.type || "text"} defaultValue={props.value} 
        
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if(props.shouldLiveUpdate) {
                console.log("live update");
                props.setValue ? props.setValue(e.currentTarget.value) : console.warn("props.setValue should be defined");
            }
            else
                changedValue.current = e.currentTarget.value;
        }} 
        
        onMouseDown={(e) => {
            if(document.activeElement !== ref.current) {
                e.preventDefault();
            }
        }}
        
        onDoubleClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.currentTarget.select();
        }}

        onFocus={() => {
            document.addEventListener("keydown", watchKeyInputForFocus);
            document.addEventListener('mousedown', globalMouseDown);
        }}
        
        onBlur={() => {

            if(!props.shouldLiveUpdate && changedValue.current !== null) {
                props.setValue ? props.setValue(changedValue.current) : console.warn("props non-live update didn't work");
                console.log("delayed update");
            }

            document.removeEventListener("keydown", watchKeyInputForFocus);
            document.removeEventListener('mousedown', globalMouseDown);
        }}

        />
    )

}

export default HiddenInputComponent;
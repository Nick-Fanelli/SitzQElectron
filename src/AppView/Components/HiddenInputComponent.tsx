import React, { ChangeEvent, useCallback, useRef } from 'react'

import './HiddenInputComponent.css'

interface HandleInputComponentProps {

    type?: string

    value: any
    setValue?: React.Dispatch<React.SetStateAction<string>>
    customSetter?: (newValue: string) => void

    className?: string

}

const HiddenInputComponent = (props: HandleInputComponentProps) => {

    const ref = useRef<HTMLInputElement>(null);

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
            if(props.customSetter) {
                props.customSetter(e.currentTarget.value);
            } else {
                props.setValue ? props.setValue(e.currentTarget.value) : console.warn("Should have props.setValue set if props.customSetter is not defined");
            }
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
            document.removeEventListener("keydown", watchKeyInputForFocus);
            document.removeEventListener('mousedown', globalMouseDown);
        }}

        />
    )

}

export default HiddenInputComponent;
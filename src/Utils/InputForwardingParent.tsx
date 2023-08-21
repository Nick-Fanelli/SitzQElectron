import { ReactNode, useEffect, useRef } from "react";

export type InputForwardingParentProvided = {

    transmitterRef: React.RefObject<any>
    receiverRef: React.RefObject<any> 

}

type ListenerPair = {

    eventType: string,
    eventListener: (event: Event) => void

}

type Props = {

    children: (provided: InputForwardingParentProvided) => ReactNode[]

}

const InputForwardingParent = (props: Props) => {

    const transmitterRef = useRef<HTMLElement>(null);
    const receiverRef = useRef<HTMLElement>(null);

    const listenerListRef = useRef<ListenerPair[]>([]);

    useEffect(() => {

        const inputEvents: (keyof HTMLElementEventMap)[] = [
            "abort",
            "animationcancel",
            "animationend",
            "animationiteration",
            "animationstart",
            "auxclick",
            "beforeinput",
            "blur",
            "cancel",
            "canplay",
            "canplaythrough",
            "change",
            "click",
            "close",
            "compositionend",
            "compositionstart",
            "compositionupdate",
            "contextmenu",
            "copy",
            "cuechange",
            "cut",
            "dblclick",
            "drag",
            "dragend",
            "dragenter",
            "dragleave",
            "dragover",
            "dragstart",
            "drop",
            "durationchange",
            "emptied",
            "ended",
            "error",
            "focus",
            "focusin",
            "focusout",
            "formdata",
            "gotpointercapture",
            "input",
            "invalid",
            "keydown",
            "keypress",
            "keyup",
            "load",
            "loadeddata",
            "loadedmetadata",
            "loadstart",
            "lostpointercapture",
            "mousedown",
            "mouseenter",
            "mouseleave",
            "mousemove",
            "mouseout",
            "mouseover",
            "mouseup",
            "paste",
            "pause",
            "play",
            "playing",
            "pointercancel",
            "pointerdown",
            "pointerenter",
            "pointerleave",
            "pointermove",
            "pointerout",
            "pointerover",
            "pointerup",
            "progress",
            "ratechange",
            "reset",
            "resize",
            "scroll",
            "securitypolicyviolation",
            "seeked",
            "seeking",
            "select",
            "selectionchange",
            "selectstart",
            "slotchange",
            "stalled",
            "submit",
            "suspend",
            "timeupdate",
            "toggle",
            "touchcancel",
            "touchend",
            "touchmove",
            "touchstart",
            "transitioncancel",
            "transitionend",
            "transitionrun",
            "transitionstart",
            "volumechange",
            "waiting",
            "webkitanimationend",
            "webkitanimationiteration",
            "webkitanimationstart",
            "webkittransitionend",
            "wheel"
        ];

        // Bind all event forwarding
        inputEvents.forEach((eventName) => {

            const listener = (event: Event) => {
                receiverRef.current?.dispatchEvent(new Event(event.type, event));
            }

            listenerListRef.current.push({ eventType: eventName, eventListener: listener });
            transmitterRef.current?.addEventListener(eventName, listener);
        });

        // Remove all listeners
        return () => {

            listenerListRef.current.forEach((listenerPair) => {
                transmitterRef.current?.removeEventListener(listenerPair.eventType, listenerPair.eventListener);
            });

        }

    }, [transmitterRef.current, receiverRef.current]);

    const provided: InputForwardingParentProvided = {

        transmitterRef,
        receiverRef

    }

    return props.children(provided);

}

export default InputForwardingParent;
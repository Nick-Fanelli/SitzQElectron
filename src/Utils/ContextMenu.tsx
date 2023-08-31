import { useRef } from "react"
import { HookUtils } from "./Utils"

import './ContextMenu.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

export interface ContextMenuItem {

    label: string
    icon: IconProp
    
    onClick: () => void

}

interface ContextMenuProps {

    menuItems: ContextMenuItem[]

    x: number
    y: number

    closeContextMenu: () => void

}

const ContextMenuComponent: React.FC<ContextMenuProps> = ({ menuItems, x, y, closeContextMenu }) => {

    const contextMenuRef = useRef<HTMLDivElement>(null);

    HookUtils.useOnClickAway(contextMenuRef, closeContextMenu);

    return (
        <div 
            ref={contextMenuRef} 
            className="context-menu"
            style={{ top: `${y}px`, left: `${x}px` }}
        >

            <ul>
                {
                    menuItems.map((item, index) => (
                        <li key={index} onClick={item.onClick}>
                            <FontAwesomeIcon className="icon" icon={item.icon} />
                            <p>{item.label}</p>
                        </li>
                    ))
                }
            </ul>

        </div>
    )

}

export default ContextMenuComponent;
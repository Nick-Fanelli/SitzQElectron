import { useRef } from "react"
import { useOnClickAway } from "../Hooks"

import './ContextMenu.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

export interface ContextMenuItem {

    type: 'MenuItem'

    label: string
    icon: IconProp
    
    onClick: () => void

}

export interface ContextMenuModifier {

    type: 'Separator'

}

interface ContextMenuProps {

    menuItems: (ContextMenuItem | ContextMenuModifier)[]

    x: number
    y: number

    closeContextMenu: () => void

}

const ContextMenuComponent: React.FC<ContextMenuProps> = ({ menuItems, x, y, closeContextMenu }) => {

    const contextMenuRef = useRef<HTMLDivElement>(null);

    useOnClickAway(contextMenuRef, closeContextMenu);

    return (
        <div 
            ref={contextMenuRef} 
            className="context-menu"
            style={{ top: `${y}px`, left: `${x}px` }}
        >

            <ul>
                {
                    menuItems.map((item, index) => {
                        
                        if(item.type === 'MenuItem') {
                            return (
                                <li key={index} onClick={item.onClick}>
                                    <FontAwesomeIcon className="icon" icon={item.icon} />
                                    <p>{item.label}</p>
                                </li>
                            );
                        } else if(item.type === 'Separator') {
                            return (
                                <li key={index} className="separator">
                                    <div className="line"></div>
                                </li>
                            )
                        }
                    })
                }
            </ul>

        </div>
    )

}

export default ContextMenuComponent;
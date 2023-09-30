import { useState } from "react";
import { Cue, UUID } from "../../Core/Cue"
import Draggable from "../../DragDrop/Draggable";
import DropTarget from "../../DragDrop/DropTarget";
import { useProjectStore } from "../State/AppViewStore";
import HiddenInputComponent from "./HiddenInputComponent";
import ContextMenuComponent from "../../Components/ContextMenu";
import { faCopy, faPaste, faX } from "@fortawesome/free-solid-svg-icons";

interface Props {

    cueSelection: UUID[],

    moveCue: (sourceUUID: UUID, sourceIndex: number, destinationIndex: number) => void,
    reportOnCueClick: (event: React.MouseEvent, uuid: UUID) => void,
    deleteCue: (cue: UUID) => void,

    cue: Cue,
    index: number

}

const InitialContextMenuData = {

    show: false,

    x: 0,
    y: 0

};

const CueComponent = ({ cueSelection, moveCue, reportOnCueClick, deleteCue, cue, index }: Props) => {

    const [ contextMenu , setContextMenu ] = useState(InitialContextMenuData);

    const updateCueByUUID = useProjectStore((state) => state.updateCueByUUID);

    const handleContextMenu = (event: React.MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>) => {

        event.preventDefault();

        const yDiff = 120;

        const { pageX, pageY } = event;
        setContextMenu({ show: true, x: pageX, y: pageY - yDiff });

    }

    const closeContextMenu = () => setContextMenu(InitialContextMenuData);

    return (
        <DropTarget key={cue.uuid + "drop-target"} acceptOnly={['cue']}
            onDrop={(dropID, dropData) => {
                if(dropID === 'cue') {
                    moveCue(dropData.uuid, dropData.index, index);
                }
            }}

            ruleOnValidationString={(validationString) => {
                const targetIndex: number = +validationString;
                return (targetIndex !== index) && (targetIndex !== index + 1)
            }}
        >
            {(dropTargetProvided, dropTargetSnapshot) => (
                <Draggable
                    key={cue.uuid.toString() + 'draggable'}
                    dragID='cue'
                    dropData={{ uuid: cue.uuid, index }}
                    validationString={index.toString()}
                    customCreateDraggableElement={() => {
                        let element = document.createElement('div');

                        let content: string = (cue.number !== null ? `${cue.number}. ` : '') + (cue.name !== null ? cue.name : '');

                        if(content.trim().length === 0)
                            content = "Unnamed Cue";

                        element.innerHTML = `
                            <p style="
                                background-color: var(--background-color);
                                flex: 0 1 auto;
                                padding: 3px 0.5em;
                                border-radius: 5px;
                                box-shadow: 0px 0px 0px rgba(0,0,0,1);
                                overflow: visible;
                                opacity: 1;
                                border: solid 2px #101010;
                            ">${content}</p>
                        `;

                        element.style.cssText = `
                            display: flex;
                            overflow: visible;
                            opacity: 1;
                            position: absolute;
                            top: -100%;
                            left: 0;
                        `

                        element.setAttribute('key', cue.uuid + '-custom-draggable-element');

                        return element;

                    }}
                >
                    {(provided, snapshot) => ([
                        <>
                            <tr
                                key={cue.uuid + 'cue-elm'}
                                className={`${cueSelection.includes(cue.uuid) ? 'selected' : ''} ${index % 2 !== 0 ? 'odd' : ''} ${snapshot.isBeingDragged ? 'beingDragged' : ''}`}
                                onClick={(event) => { reportOnCueClick(event, cue.uuid) }}
                                {...provided}
                                {...dropTargetProvided}

                                onContextMenu={ (event) => handleContextMenu(event) }
                            >
                                <td className="info" style={{ width: "100px" }}>
                                    <div className="machine-id"></div>
                                    <div className="machine-highlight"></div>
                                </td>
                                <td className="cue-number" style={{ width: "100px" }}>
                                    <HiddenInputComponent type="number" value={cue.number || ""} setValue={(newValue: string) => {
                                        updateCueByUUID(cue.uuid, (prevCue) => {
                                            return {
                                                ...prevCue,
                                                number: newValue.length === 0 ? null : +newValue
                                            }
                                        })
                                    }} />
                                </td>
                                <td>
                                    <HiddenInputComponent value={cue.name || ""} setValue={(newValue: string) => {
                                        updateCueByUUID(cue.uuid, (prevCue) => {
                                            return {
                                                ...prevCue,
                                                name: newValue
                                            }
                                        })
                                    }} />
                                </td>
                                <td>{cue.name} {cue.number}</td>
                            </tr>
                            {
                                contextMenu.show && <ContextMenuComponent

                                        x={contextMenu.x}
                                        y={contextMenu.y}

                                        closeContextMenu={closeContextMenu}

                                        menuItems={[

                                            {
                                                type: 'MenuItem', label: "Copy", icon: faCopy, onClick: () => {

                                                }
                                            },

                                            {
                                                type: 'MenuItem', label: "Paste After", icon: faPaste, onClick: () => {

                                                }
                                            },

                                            {
                                                type: "Separator"
                                            },

                                            { type: 'MenuItem', label: "Delete", icon: faX, onClick: () => {
                                                deleteCue(cue.uuid);
                                                closeContextMenu();
                                            }}

                                        ]}

                                />
                            }
                        </>,
                        dropTargetSnapshot.isDraggedOver ?
                        <tr className="light" key={cue.uuid + 'cue-light'}></tr>
                        : null
                    ])}
                </Draggable>
            )}
            
        </DropTarget>
    )


}

export default CueComponent;
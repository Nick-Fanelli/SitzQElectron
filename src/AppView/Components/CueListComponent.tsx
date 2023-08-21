import { useCallback, useState } from "react";
import { Cue, UUID } from "../../Core/Cue";

import HiddenInputComponent from "./HiddenInputComponent";

import { useProjectStore } from "../State/AppViewStore";
import './CueListComponent.css';
import Draggable from "../../DragDrop/Draggable";
import DropTarget from "../../DragDrop/DropTarget";
import InputForwardingParent from "../../Utils/InputForwardingParent";

const CueListComponent = () => {

    const cueList = useProjectStore((state) => state.cueList);
    const setCueList = useProjectStore((state) => state.setCueList);
    const createCue = useProjectStore((state) => state.createCue);
    const updateCueByUUID = useProjectStore((state) => state.updateCueByUUID);

    const [ cueSelection, setCueSelection ] = useState<UUID[]>([]);

    const reportOnCueClick = useCallback((uuid: UUID) => {

        setCueSelection([uuid]);

    }, [setCueSelection]);

    return (
        <section id="cue-list">

            <button onClick={() => { createCue(Cue) }}>Create Cue</button>

            <div>
                <table id="cue-list">
                    <thead>
                        <tr>
                            <th className="rigid"></th>
                            <th className="">#</th>
                            <th>Name</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cueList.map((cue, index) => (
                            <InputForwardingParent key={cue.uuid}>
                                {inputForwardingProvided => ([
                                    <Draggable key={cue.uuid + "draggable"}
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
                                            `

                                            return element;

                                        }}
                                    >
                                        {(provided, snapshot) => (
                                            <tr
                                                className={`${index % 2 !== 0 ? 'odd' : ''} ${snapshot.isBeingDragged ? 'beingDragged' : ''}`}
                                                onClick={() => { reportOnCueClick(cue.uuid); console.log("CLICK") }}
                                                {...provided}
                                                ref={inputForwardingProvided.transmitterRef}
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
                                        )}
                                    </Draggable>,
                                    <DropTarget key={cue.uuid + "drop-target"}>
                                        {(provided, snapshot) => ([
                                            <tr className={`drop-target `} {...provided} ref={inputForwardingProvided.receiverRef}>
                                            </tr>,
                                            <tr className={`light ${snapshot.isDraggedOver ? 'hovered' : ''}`}>
                                            </tr>
                                        ])}
                                    </DropTarget>  
                                ])}
                            </InputForwardingParent>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* <DragDropContext onDragEnd={onDragEnd}>
                <StrictModeDroppable droppableId="cue-list-droppable">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            <table id="cue-list">
                                <thead>
                                    <tr>
                                        <th className="rigid"></th>
                                        <th className="">#</th>
                                        <th>Name</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cueList.map((cue, index) => (
                                        <Draggable key={cue.uuid} draggableId={cue.uuid} index={index}>
                                            {(provided, snapshot) => (
                                                <tr
                                                    hierarchy-value='droppable-parent'
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getRowStyle(provided.draggableProps.style!, snapshot)}
                                                    className={`${cueSelection.includes(cue.uuid) ? "selected" : ""}`}
                                                    onClick={() => reportOnCueClick(cue.uuid)}
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
                                            )}
                                        </Draggable>
                                    ))}
                                </tbody>
                            </table>
                            {provided.placeholder}
                        </div>
                    )}
                </StrictModeDroppable>
            </DragDropContext> */}
        </section>

    )

}

export default CueListComponent;
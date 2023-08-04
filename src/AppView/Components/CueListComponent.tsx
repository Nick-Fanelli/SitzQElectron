import React, { useCallback, useState } from "react";
import { DragDropContext, Draggable, DraggableStateSnapshot, DropResult } from "react-beautiful-dnd";
import { UUID } from "../../Core/Cue";
import { ArrayUtils } from "../../Utils/Utils";
import { StrictModeDroppable } from "./StrictModeDroppable";

import HiddenInputComponent from "./HiddenInputComponent";

import { useProjectStore } from "../State/AppViewStore";
import './CueListComponent.css';

const getRowStyle = (style: React.CSSProperties, snapshot: DraggableStateSnapshot): React.CSSProperties => {

    const defaultStyle: React.CSSProperties = {
        display: snapshot.isDragging ? "table" : 'table-row',
    }

    if (!snapshot.isDropAnimating) {
        return {
            ...defaultStyle,
            ...style
        };
    }

    return {
        ...style,
        ...defaultStyle,
        transition: "all 0.2s ease",
    }

}

const CueListComponent = () => {

    const cueList = useProjectStore((state) => state.cueList);
    const setCueList = useProjectStore((state) => state.setCueList);
    // const createCue = useProjectStore((state) => state.createCue);
    const updateCueByUUID = useProjectStore((state) => state.updateCueByUUID);

    const [cueSelection, setCueSelection] = useState<UUID[]>([]);

    const onDragEnd = useCallback((result: DropResult) => {

        if (!result.destination)
            return;

        const reorderedCues = ArrayUtils.reorderArray(
            cueList,
            result.source.index,
            result.destination.index
        );

        setCueList(reorderedCues);

    }, [cueList, setCueList]);

    const reportOnCueClick = useCallback((uuid: UUID) => {

        setCueSelection([uuid]);

    }, [setCueSelection]);

    return (
        <section id="cue-list">

            <DragDropContext onDragEnd={onDragEnd}>
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
            </DragDropContext>
        </section>

    )

}

export default CueListComponent;
import React, { ChangeEvent, useCallback, useState } from "react";
import { DragDropContext, Draggable, DraggableStateSnapshot, DropResult } from "react-beautiful-dnd";
import { Cue, CueList } from "../Core/Cue";
import { ArrayUtils } from "../Utils/Utils";
import { StrictModeDroppable } from "./StrictModeDroppable";

import './CueListComponent.css'

const getRowStyle = (style: React.CSSProperties, snapshot: DraggableStateSnapshot) : React.CSSProperties => {

    const defaultStyle: React.CSSProperties = {
        display: snapshot.isDragging ? "table" : 'table-row',
    }

    if(!snapshot.isDropAnimating) {
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

    const [ cueList, setCueList ] = useState<Cue[]>([]);

    const onDragEnd = useCallback((result: DropResult) => {

        if(!result.destination)
            return;

        const reorderedCues = ArrayUtils.reorderArray(
            cueList,
            result.source.index,
            result.destination.index
        );

        setCueList(reorderedCues);

    }, [cueList, setCueList]);

    return (
        <>

        <button onClick={() => {
            setCueList((prev) => CueList.createNewCue(prev, Cue));
        }}>Create New Cue</button>
        
        <button onClick={() => setCueList([])}>Clear Cues</button>

        <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable droppableId="cue-list-droppable">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        <table id="cue-list">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cueList.map((cue, index) => (
                                    <Draggable key={cue.uuid} draggableId={cue.uuid} index={index}>
                                        {(provided, snapshot) => (
                                            <tr
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getRowStyle(provided.draggableProps.style!, snapshot)}
                                            >
                                                <td className="info" style={{width: "100px"}}>
                                                    <div className="machine-id"></div>
                                                </td>
                                                <td>
                                                    <input type="number" className="hidden-input" value={cue.number ? cue.number : ""} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        setCueList((prev) => CueList.updateCueNumber(prev, cue.uuid, e.target.value.length === 0 ? null : +e.target.value));
                                                    }} />
                                                </td>
                                                <td>
                                                    <input type="text" className="hidden-input" value={cue.name ? cue.name : ""} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        setCueList((prev) => CueList.updateCueName(prev, cue.uuid, e.target.value));
                                                    }}/>
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

        </>

    )

}

export default CueListComponent;
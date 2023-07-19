import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, DraggableStateSnapshot, DropResult } from "react-beautiful-dnd";
import { Cue, CueList, UUID } from "../Core/Cue";
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
    const [ cueSelection, setCueSelection ] = useState<UUID[]>([]);

    // Debug
    useEffect(() => {

        let tempCues: Cue[] = [];

        for(let i = 0; i < 20; i++) {
            tempCues = CueList.createNewCue(tempCues, Cue);
        }

        setCueList(tempCues);

    }, [setCueList]);

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

    const reportOnCueClick = useCallback((e: React.MouseEvent, uuid: UUID) => {

        let trigger = (e.target as HTMLElement).getAttribute('no-trigger-selection');

        if(trigger === null) {
            setCueSelection([ uuid ]);
        }

    }, [setCueSelection]);
  
    return (
        <section id="cue-list">
{/* 
            <button onClick={() => {
                setCueList((prev) => CueList.createNewCue(prev, Cue));
            }}>Create New Cue</button>
            
            <button onClick={() => setCueList([])}>Clear Cues</button> */}

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
                                                    onClick={(e: React.MouseEvent) => reportOnCueClick(e, cue.uuid)}
                                                >
                                                    <td className="info" style={{width: "100px"}}>
                                                        <div className="machine-id"></div>
                                                        <div className="machine-highlight"></div>
                                                    </td>
                                                    <td className="cue-number" style={{width: "100px"}}>
                                                        <input type="number" no-trigger-selection="true" className="hidden-input" value={cue.number ? cue.number : ""} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                            setCueList((prev) => CueList.updateCueNumber(prev, cue.uuid, e.target.value.length === 0 ? null : +e.target.value));
                                                        }} />
                                                    </td>
                                                    <td>
                                                        <input type="text" no-trigger-selection="true" className="hidden-input" value={cue.name ? cue.name : ""} onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
        </section>

    )

}

export default CueListComponent;
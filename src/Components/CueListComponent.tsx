import { useCallback, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { Cue, CueList } from "../Core/Cue";
import { ArrayUtils } from "../Utils/Utils";
import { StrictModeDroppable } from "./StrictModeDroppable";

import './CueListComponent.css'

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
                                    <th></th> { /* Cue Type */ }
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
                                                style={{
                                                    display: snapshot.isDragging ? "table" : 'table-row',
                                                    ...provided.draggableProps.style
                                                }}
                                            >
                                                <td>
                                                    
                                                </td>
                                                <td>{cue.number}</td>
                                                <td>{cue.uuid}</td>
                                                <td>
                                                    hey
                                                </td>
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
import { useCallback, useMemo, useState } from "react";
import { Cue, UUID } from "../../Core/Cue";

import HiddenInputComponent from "./HiddenInputComponent";

import { useProjectStore } from "../State/AppViewStore";
import './CueListComponent.css';
import Draggable from "../../DragDrop/Draggable";
import DropTarget from "../../DragDrop/DropTarget";
import { ArrayUtils } from "../../Utils/Utils";

const CueListComponent = () => {

    const cueList = useProjectStore((state) => state.cueList);
    const setCueList = useProjectStore((state) => state.setCueList);
    const createCue = useProjectStore((state) => state.createCue);
    const updateCueByUUID = useProjectStore((state) => state.updateCueByUUID);

    const singleSelectKey: 'meta' | 'control' = useMemo(() => {

        if(window.electronAPI.machineAPI.osType() === "MacOS")
            return 'meta';

        return 'control';

    }, [window.electronAPI.machineAPI.osType])

    const [ cueSelection, setCueSelection ] = useState<UUID[]>([]);

    const moveCue = useCallback((sourceIndex: number, destinationIndex: number) => {
        const reorderedCues = ArrayUtils.reorderArray(cueList, sourceIndex, destinationIndex);

        setCueList(reorderedCues);
    }, [cueList, setCueList]);

    const reportOnCueClick = useCallback((event: React.MouseEvent, uuid: UUID) => {

        if(singleSelectKey === 'meta' ? event.metaKey : event.ctrlKey) { // Single Select

            const updatedCues = [...cueSelection];
            const index = updatedCues.indexOf(uuid);

            if(index === -1) {
                updatedCues.push(uuid);
            } else {
                updatedCues.splice(index, 1);
            }

            setCueSelection(updatedCues);

        } else { // Override to just that one cue
            setCueSelection([uuid]);
        }


    }, [cueSelection, setCueSelection]);

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
                            <DropTarget key={cue.uuid} acceptOnly={['cue']}
                                onDrop={(dropID, dropData) => {
                                    if(dropID === 'cue') {
                                        if(dropData.index <= index) {
                                            moveCue(dropData.index, index);
                                        } else {
                                            moveCue(dropData.index, index + 1);
                                        }
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
                                            `

                                            element.setAttribute('key', cue.uuid + '-custom-draggable-element');

                                            return element;

                                        }}
                                    >
                                        {(provided, snapshot) => ([
                                            <tr
                                                key={cue.uuid + 'cue-elm'}
                                                className={`${cueSelection.includes(cue.uuid) ? 'selected' : ''} ${index % 2 !== 0 ? 'odd' : ''} ${snapshot.isBeingDragged ? 'beingDragged' : ''}`}
                                                onClick={(event) => { reportOnCueClick(event, cue.uuid) }}
                                                {...provided}
                                                {...dropTargetProvided}
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
                                            </tr>,
                                            dropTargetSnapshot.isDraggedOver ?
                                            <tr className="light" key={cue.uuid + 'cue-light'}></tr>
                                            : null
                                        ])}
                                    </Draggable>
                                )}
                                
                            </DropTarget>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

    )

}

export default CueListComponent;
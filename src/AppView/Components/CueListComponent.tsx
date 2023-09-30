import { useCallback, useMemo, useState } from "react";
import { Cue, CueList, UUID } from "../../Core/Cue";

import { useProjectStore } from "../State/AppViewStore";
import './CueListComponent.css';
import CueComponent from "./CueComponent";

const reorderArray = (list: any[], sourceIndex: number, destinationIndex: number) : any[] => {
    const result = Array.from(list);
    const [ removed ] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);

    return result;
}

const CueListComponent = () => {

    const cueList = useProjectStore((state) => state.cueList);
    const setCueList = useProjectStore((state) => state.setCueList);

    const createCue = useProjectStore((state) => state.createCue);

    const singleSelectKey: 'meta' | 'control' = useMemo(() => {

        if(window.electronAPI.machineAPI.osType() === "MacOS")
            return 'meta';

        return 'control';

    }, [window.electronAPI.machineAPI.osType])

    const [ cueSelection, setCueSelection ] = useState<UUID[]>([]);

    const moveCue = useCallback((sourceUUID: UUID, sourceIndex: number, destinationIndex: number) => {

        let reorderedCues = [...cueList];

        if(cueSelection.length <= 1 || !cueSelection.includes(sourceUUID)) { // Handle Single Cue Move

            reorderedCues = reorderArray(reorderedCues, sourceIndex, destinationIndex + (sourceIndex > destinationIndex ? 1 : 0));

        } else { // Handle multi cue move

            let targetCues: Cue[] = [];
            let firstSelectedDestinationIndex: number | null = null;

            for(let i = 0; i < reorderedCues.length; i++) {

                const targetUUID = reorderedCues[i].uuid;
                const selectionIndex = cueSelection.indexOf(targetUUID);

                if(selectionIndex !== -1) {
                    if(!firstSelectedDestinationIndex)
                        firstSelectedDestinationIndex = i;

                    targetCues.push(reorderedCues[i]);
                    reorderedCues.splice(i, 1);
                    i--;
                }

            }

            if(firstSelectedDestinationIndex !== null) {
                reorderedCues.splice(destinationIndex + (firstSelectedDestinationIndex > destinationIndex ? 1 : -1), 0, ...targetCues);
            }
        }

        setCueList(reorderedCues);

    }, [cueList, setCueList, cueSelection]);

    const deleteCue = useCallback((cue: UUID) => {

        // Remove cue from current selection
        const selectionIndex = cueSelection.indexOf(cue);
        if(selectionIndex !== -1) {
            setCueSelection((prev) => (
                prev.splice(selectionIndex, 1)
            ));
        }

        const updatedCues = CueList.deleteCue(cueList, cue);
        setCueList(updatedCues);

    }, [cueList, setCueList, cueSelection, setCueSelection]);


    const reportOnCueClick = useCallback((event: React.MouseEvent, uuid: UUID) => {

        if(event.shiftKey) { // Shift Through Multi-select

        } else if(singleSelectKey === 'meta' ? event.metaKey : event.ctrlKey) { // Multi Select

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
                            <CueComponent key={index} index={index} cue={cue} moveCue={moveCue} reportOnCueClick={reportOnCueClick} cueSelection={cueSelection} deleteCue={deleteCue} />
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

    )

}

export default CueListComponent;
import { v4 as uuidgenUUID } from 'uuid';

type UUID = string;

class Cue {

    uuid: UUID;
    number: number | null = null;
    name: string | null = null;

    constructor(uuid: UUID) {
        this.uuid = uuid;
    }

}

class SoundCue extends Cue {

    constructor(uuid: UUID) {
        super(uuid);
    }

}

const generateCueUUID = () : UUID => {
    let uuid = uuidgenUUID();
    return uuid.substring(uuid.length - 12);
}

namespace CueList {

    const isDuplicateUUID = (uuid: UUID, cues: Cue[]) : boolean => {
        for(const cue of cues) {
            if(cue.uuid === uuid) {
                return true;
            }
        }

        return false;
    }

    const generateUniqueUUID = (cues: Cue[]) : UUID => {
        let uuid = generateCueUUID();

        while(isDuplicateUUID(uuid, cues)) {
            uuid = generateCueUUID();
        }

        return uuid;
    }

    export const getIndexByUUID = (cues: ReadonlyArray<Cue>, uuid: UUID): number => {
        return cues.findIndex(cue => cue.uuid === uuid);
    }

    const getIndexByUUIDCallback = (cues: ReadonlyArray<Cue>, uuid: UUID, callback: (index: number) => Cue[]) : Cue[] => {
        const index = getIndexByUUID(cues, uuid);

        if(index === -1) {
            console.warn(`Could not find cue with UUID of: '${uuid}' in the array of cues`);
            return [...cues];
        }

        return callback(index);
    }

    export const createNewCue = <CueType extends Cue>(constCues: ReadonlyArray<Cue>, cueType: { new (uuid: UUID) : CueType }): Cue[] => {

        let cues = [...constCues];

        let uuid = generateUniqueUUID(cues);
        let cue = new cueType(uuid);

        cues.push(cue);

        return cues;
    }

    export const deleteCue = (constCues: ReadonlyArray<Cue>, uuid: UUID): Cue[] => {
        let cues = [...constCues];

        return getIndexByUUIDCallback(cues, uuid, (index: number) => {

            cues.splice(index, 1);

            return cues;

        });
    }

    export const updateCueName = (constCues: ReadonlyArray<Cue>, uuid: UUID, newName: string) => {
        const cues = [...constCues];

        return getIndexByUUIDCallback(cues, uuid, (index: number) => {
            cues[index].name = newName;

            return cues;
        });
    }

    export const updateCueNumber = (constCues: ReadonlyArray<Cue>, uuid: UUID, newNumber: number | null) => {

        const cues = [...constCues];

        return getIndexByUUIDCallback(cues, uuid, (index: number) => {
            cues[index].number = newNumber;

            return cues;
        });

    }

}

export type { UUID };
export { CueList, Cue, SoundCue };
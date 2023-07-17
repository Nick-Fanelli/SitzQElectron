import { v4 as uuidgenUUID } from 'uuid';

type UUID = string;

class Cue {

    uuid: UUID;
    number: number | null = null;

    constructor(uuid: UUID) {
        this.uuid = uuid;
    }

}

class SoundCue extends Cue {

    static IdentificationBits: string = "01";

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

    const getIndexByUUID = (cues: Cue[], uuid: UUID): number => {
        return cues.findIndex(cue => cue.uuid === uuid);
    }

    export const createNewCue = <CueType extends Cue>(cuesToCopy: Cue[], cueType: { new (uuid: UUID) : CueType }): Cue[] => {

        let cues = [...cuesToCopy];

        let uuid = generateUniqueUUID(cues);
        let cue = new cueType(uuid);

        cues.push(cue);

        return cues;
    }

    export const deleteCue = (cuesToCopy: Cue[], uuid: UUID): Cue[] => {
        let cues = [...cuesToCopy];

        let index = getIndexByUUID(cues, uuid);

        if(index === -1) {
            console.warn(`Could not find cue with UUID of: '${uuid}' in the array of cues`);
            return cues;
        }

        cues.splice(index, 1);
        return cues;
    }

}

export type { UUID };
export { CueList, Cue, SoundCue };
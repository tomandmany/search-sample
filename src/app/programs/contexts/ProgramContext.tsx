// src/app/programs/contexts/ProgramContext.tsx
'use client';

import { createContext, Dispatch, SetStateAction } from 'react';

export type ProgramContextType = {
    programs: UnionProgram[];
    participants: Participant[];
    participantSocialMedias: ParticipantSocialMedia[];
    // minHeight: number;
    // setMinHeight: Dispatch<SetStateAction<number>>;
    maxWidths: { [key: string]: number };
    setMaxWidth: (header: string, width: number) => void;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export default ProgramContext;

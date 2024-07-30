// src/app/programs/contexts/ProgramContext.tsx
'use client';

import { createContext, Dispatch, SetStateAction } from 'react';

export type ProgramContextType = {
    target: Target;
    setTarget: Dispatch<SetStateAction<Target>>;
    maxWidths: { [key: string]: number };
    setMaxWidth: (header: string, width: number) => void;
    rowHeights: { [key: string]: number };
    setRowHeight: (header: string, width: number) => void;
};

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export default ProgramContext;

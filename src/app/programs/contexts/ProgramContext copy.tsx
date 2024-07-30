// src/app/programs/contexts/ProgramContext.tsx
'use client';

import { createContext } from 'react';

export type ProgramContextType = {
    maxWidths: { [key: string]: number };
    setMaxWidth: (header: string, width: number) => void;
};

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export default ProgramContext;

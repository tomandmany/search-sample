// src/app/programs/contexts/ProgramProvider.tsx
'use client';

import { useState, useCallback } from 'react';
import ProgramContext from './ProgramContext';

type ProgramProviderProps = {
    children: React.ReactNode;
};

const ProgramProvider = ({ children }: ProgramProviderProps) => {
    const [target, setTarget] = useState<Target>('booth');
    const [maxWidths, setMaxWidths] = useState<{ [key: string]: number }>({});
    const [rowHeights, setRowHeights] = useState<{ [key: string]: number }>({});

    const memoizedSetMaxWidth = useCallback((header: string, width: number) => {
        setMaxWidths((prevMaxWidths) => {
            if (!prevMaxWidths[header] || width > prevMaxWidths[header]) {
                return { ...prevMaxWidths, [header]: width };
            }
            return prevMaxWidths;
        });
    }, []);

    const memoizedSetRowHeight = useCallback((participantId: string, height: number, prevHeight?: number) => {
        setRowHeights((prev) => {
            if (prevHeight !== undefined) {
                const newRowHeights = { ...prev, [participantId]: prevHeight };
                return newRowHeights;
            } else {
                return { ...prev, [participantId]: Math.max(prev[participantId] || 0, height) };
            }
        });
    }, []);

    return (
        <ProgramContext.Provider
            value={{
                target,
                setTarget,
                maxWidths,
                setMaxWidth: memoizedSetMaxWidth,
                rowHeights,
                setRowHeight: memoizedSetRowHeight
            }}
        >
            {children}
        </ProgramContext.Provider>
    );
};

export default ProgramProvider;

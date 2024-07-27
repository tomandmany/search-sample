// src/components/TableCell.tsx
'use client'
import {
    useContext,
    useEffect,
    useRef,
    useState,
    KeyboardEvent as ReactKeyboardEvent,
    FocusEvent as ReactFocusEvent
} from "react";
import ProgramContext, { ProgramContextType } from "@/app/programs/contexts/ProgramContext";
import updateProgram from "@/actions/programs/updateProgram";

type TableCellProps = {
    header: string;
    property?: string;
    programId?: string;
    value: string;
    programContext?: React.Context<ProgramContextType | undefined>;
    venue?: 'booth' | 'outstage' | 'room';
}

const getWidth = (text: string, font: string): number => {
    if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = font;
            const metrics = context.measureText(text);
            return metrics.width;
        }
    }
    return 50;
};

export default function TableCell({ header, property, programId, value, programContext = ProgramContext, venue }: TableCellProps) {
    const [inputValue, setInputValue] = useState<string>(value);
    const [inputWidth, setInputWidth] = useState<number>(50);
    const ref = useRef<HTMLDivElement>(null);

    const context = useContext(programContext);
    if (!context) {
        throw new Error('TableCell must be used within a Provider');
    }
    const { minHeight, setMinHeight } = context;

    useEffect(() => {
        const font = getComputedStyle(document.body).font;
        const width = getWidth(inputValue, font) + 20; // 余白のために少し幅を追加
        setInputWidth(width);
    }, [inputValue]);

    useEffect(() => {
        if (ref.current) {
            const currentHeight = ref.current.offsetHeight;
            setMinHeight((prevMinHeight) => Math.max(prevMinHeight, currentHeight));
        }
    }, [setMinHeight]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = async (event: ReactKeyboardEvent<HTMLInputElement>) => {
        if ((event.metaKey && event.key === 'Enter') || (event.ctrlKey && event.key === 'Enter')) {
            const target = event.target as HTMLInputElement;
            target.blur(); // Blur the input to trigger the handleBlur event
        }
    };

    const handleBlur = async (event: ReactFocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const formData = new FormData();
        if (programId) {
            formData.append('id', programId);
        }
        formData.append(property || 'unknown', inputValue);
        if (venue) {
            const response = await updateProgram(formData, venue);
            if (!response.success) {
                console.error('Failed to update program:', response.error);
            } else {
                console.log('Program updated successfully:', response.data);
            }
        }
    };

    let content;
    switch (header) {
        default:
            content = (
                <input
                    type="text"
                    value={inputValue}
                    className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    style={{ minWidth: `${inputWidth}px`, width: `${inputWidth}px` }}
                />
            );
    }

    return (
        <div
            ref={ref}
            className={`min-w-max p-2 bg-white border-b flex items-center ${header === "channels" && "justify-center"}`}
            style={{ minHeight: `${minHeight}px` }}
        >
            {content}
        </div>
    );
}

'use client';

import {
    useContext,
    useEffect,
    useRef,
    useState,
    KeyboardEvent as ReactKeyboardEvent,
    FocusEvent as ReactFocusEvent,
} from 'react';
import ProgramContext, { ProgramContextType } from '@/app/programs/contexts/ProgramContext';
import updateProgram from '@/actions/programs/updateProgram';
import CustomSelect from './contents/CustomSelect';
import PhotographPermission from './contents/PhotographPermission';
import SocialMedia from './contents/SocialMedia';

type TableCellProps = {
    header: string;
    property?: string;
    programId?: string;
    participantId: string;
    value: string;
    programContext?: React.Context<ProgramContextType | undefined>;
    department?: 'booth' | 'outstage' | 'room';
    rowHeight: number;
    setRowHeight: (height: number) => void;
};

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

const selectOptions: { [key: string]: string[] } = {
    "ジャンル": ["音楽", "ダンス", "パフォーマンス"],
    "実施場所": ["メインステージ", "パフォーマンスエリア", "エントランスエリア"],
    "企画実施日": ["2日", "3日", "4日"]
};

export default function TableCell({ header, property, programId, participantId, value, programContext = ProgramContext, department, rowHeight, setRowHeight }: TableCellProps) {
    const [inputValue, setInputValue] = useState<string>(value);
    const [inputWidth, setInputWidth] = useState<number>(50);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
    const [currentParticipantSocialMedias, setCurrentParticipantSocialMedias] = useState<ParticipantSocialMedia[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    const context = useContext(programContext);
    if (!context) {
        throw new Error('TableCell must be used within a Provider');
    }
    const { maxWidths, setMaxWidth } = context;

    useEffect(() => {
        const font = getComputedStyle(document.body).font;
        const width = getWidth(inputValue, font) + 18; // 余白のために少し幅を追加
        setInputWidth(width);
        setMaxWidth(header, width);
    }, [inputValue, header, setMaxWidth]);

    useEffect(() => {
        if (ref.current) {
            const currentHeight = ref.current.offsetHeight;
            if (currentHeight !== rowHeight) {
                setRowHeight(currentHeight);
            }
        }
    }, [inputValue, currentParticipantSocialMedias, rowHeight, setRowHeight]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInputValue(event.target.value);
        setHasUnsavedChanges(true);
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
        if (department) {
            const response = await updateProgram(formData, department);
            setHasUnsavedChanges(false);
            if (!response.success) {
                console.error('Failed to update program:', response.error);
            } else {
                console.log('Program updated successfully:', response.data);
            }
        }
    };

    const maxWidth = maxWidths[header] || inputWidth;

    let content;
    if (selectOptions[header]) {
        content = (
            <CustomSelect
                value={inputValue}
                options={selectOptions[header]}
                onChange={handleChange}
                onBlur={handleBlur}
                maxWidth={maxWidth}
            />
        );
    } else {
        switch (header) {
            case '撮影の可否':
                content = (
                    <PhotographPermission
                        programId={programId}
                        value={inputValue}
                        department={department}
                        setHasUnsavedChanges={setHasUnsavedChanges}
                        setInputValue={setInputValue}
                    />
                );
                break;
            case "SNSアカウント":
                content = (
                    participantId &&
                    <SocialMedia
                        participantId={participantId}
                        programContext={programContext}
                        department={department}
                        currentParticipantSocialMedias={currentParticipantSocialMedias}
                        setCurrentParticipantSocialMedias={setCurrentParticipantSocialMedias}
                        setRowHeight={setRowHeight}
                    />
                );
                break;
            default:
                content = (
                    <input
                        type="text"
                        value={inputValue}
                        className={`cursor-pointer rounded px-2 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text`}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        style={{ minWidth: `${maxWidth}px` }}
                    />
                );
        }
    }

    return (
        <div
            ref={ref}
            className={`min-w-max p-2 bg-white border-b flex items-center ${header === 'SNSアカウント' && 'justify-center'}`}
            style={{ minHeight: `${rowHeight}px` }}
        >
            {content}
        </div>
    );
}

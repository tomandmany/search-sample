// @filename: /src/components/TableCell.tsx
'use client';

import {
    useContext,
    useEffect,
    useRef,
    useState,
    KeyboardEvent,
    FocusEvent,
    Dispatch,
    SetStateAction
} from 'react';
import ProgramContext from '@/app/programs/contexts/ProgramContext';
import updateParticipant from '@/actions/participants/updateParticipant';
import CustomSelect from './contents/CustomSelect';
import PhotographPermission from './contents/PhotographPermission';
import SocialMedia from './contents/SocialMedia';
import ProgramImage from './contents/ProgramImage';
import updateProgram from '@/actions/programs/updateProgram';

type TableCellProps = {
    program?: UnionProgram;
    participant: Participant;
    participantSocialMedias: ParticipantSocialMedia[];
    columnKey: string;
    isParticipantColumn: boolean;
    onParticipantSocialMediaChanges: Dispatch<SetStateAction<ParticipantSocialMedia[]>>;
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
    'genre': ['音楽', 'ダンス', 'パフォーマンス'],
    'venue': ['メインステージ', 'パフォーマンスエリア', 'エントランスエリア'],
    'eventDate': ['2日', '3日', '4日']
};

export default function TableCell({
    program,
    participant,
    participantSocialMedias,
    columnKey,
    isParticipantColumn,
    onParticipantSocialMediaChanges: handleParticipantSocialMediaChanges
}: TableCellProps) {
    const context = useContext(ProgramContext);
    if (!context) {
        throw new Error('TableCell must be used within a Provider');
    }
    const { maxWidths, setMaxWidth, rowHeights, setRowHeight, target } = context;

    const [inputValue, setInputValue] = useState<string>('');
    const [inputWidth, setInputWidth] = useState<number>(50);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initialInputValue = isParticipantColumn
            ? participant[columnKey as keyof Participant]
            : program ? program[columnKey as keyof UnionProgram] : '';
        setInputValue(initialInputValue!);
    }, [isParticipantColumn, program, participant, columnKey]);

    useEffect(() => {
        const font = getComputedStyle(document.body).font;
        const width = getWidth(inputValue, font) + 18; // 余白のために少し幅を追加
        setInputWidth(width);
        setMaxWidth(columnKey, width);
    }, [inputValue, columnKey, setMaxWidth]);

    useEffect(() => {
        if (ref.current) {
            const currentHeight = ref.current.offsetHeight;
            setRowHeight(participant.id, currentHeight);
        }
    }, [participant.id, setRowHeight]);

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

    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if ((event.metaKey && event.key === 'Enter') || (event.ctrlKey && event.key === 'Enter')) {
            const target = event.target as HTMLInputElement;
            target.blur(); // Blur the input to trigger the handleBlur event
        }
    };

    const handleBlur = async (event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newValue = event.target.value;
        if (newValue.trim() === '') {
            setError('このフィールドは空にできません');
            return;
        }
        if (!program?.id && !participant.id) {
            setError('No ID provided');
            return;
        }
        const formData = new FormData();
        if (isParticipantColumn) {
            if (participant.id) {
                formData.append('id', participant.id);
                if (columnKey) {
                    formData.append(columnKey, newValue);
                }
                const response = await updateParticipant(formData);
                if (!response.success) {
                    console.error('Failed to update participant:', response.error);
                    setError('Failed to update participant');
                } else {
                    setError(null);
                }
            }
        } else {
            if (program?.id) {
                formData.append('id', program.id);
                if (columnKey) {
                    formData.append(columnKey, newValue);
                }
                const response = await updateProgram(formData, target);
                if (!response.success) {
                    console.error('Failed to update program:', response.error);
                    setError('Failed to update program');
                } else {
                    setError(null);
                }
            }
        }
        setHasUnsavedChanges(false);
    };

    const maxWidth = maxWidths[columnKey] || inputWidth;
    const maxHeight = Math.max(...Object.values(rowHeights)) || 'auto';

    let content;
    if (program) {
        if (selectOptions[columnKey]) {
            content = (
                <CustomSelect
                    value={inputValue}
                    options={selectOptions[columnKey]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxWidth={maxWidth}
                />
            );
        } else {
            switch (columnKey) {
                case 'photographPermission':
                    content = (
                        <PhotographPermission
                            programId={program?.id}
                            value={program?.photographPermission}
                            setHasUnsavedChanges={setHasUnsavedChanges}
                        />
                    );
                    break;
                case 'socialMedia':
                    content = (
                        <SocialMedia
                            participantId={participant.id}
                            participantSocialMedias={participantSocialMedias}
                            tableCellRef={ref}
                            onParticipantSocialMediaChanges={handleParticipantSocialMediaChanges}
                        />
                    );
                    break;
                case 'programImage':
                    content = (
                        <ProgramImage
                            programId={program?.id}
                            participantId={participant.id}
                            imageUrl={program?.programImage!}
                            tableCellRef={ref}
                        />
                    );
                    break;
                default:
                    content = (
                        <input
                            type="text"
                            value={inputValue}
                            className={`cursor-pointer rounded px-2 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text ${error && 'border-2 border-red-600'}`}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            style={{ minWidth: `${maxWidth}px` }}
                        />
                    );
            }
        }
    } else {
        switch (columnKey) {
            case 'socialMedia':
                content = (
                    <SocialMedia
                        participantId={participant.id}
                        participantSocialMedias={participantSocialMedias}
                        tableCellRef={ref}
                        onParticipantSocialMediaChanges={handleParticipantSocialMediaChanges}
                    />
                );
                break;
            default:
                content = (
                    <input
                        type="text"
                        value={inputValue}
                        className={`cursor-pointer rounded px-2 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text ${error && 'border-2 border-red-600'}`}
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
            className={`min-w-max p-2 bg-white border-b flex flex-col justify-center items-center ${columnKey === 'SNSアカウント' && 'justify-center'}`}
            style={{ minHeight: `${maxHeight}px` }}
        >
            {content}
            {error && <div className="text-red-600">{error}</div>}
        </div>
    );
}

// @filename: /src/components/contents/BooleanSelect.tsx
'use client';

import { useContext, useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Circle, X } from 'lucide-react';
import updateProgram from '@/actions/programs/updateProgram';
import IconQuestion from '../../icons/IconQuestion';
import ProgramContext from '@/app/programs/contexts/ProgramContext';

type BooleanSelectProps = {
    programId: string;
    options: { value: string, label: string }[];
    value: string;
    setHasUnsavedChanges: (value: boolean) => void;
    columnKey: string;
};

export default function BooleanSelect({
    programId,
    columnKey,
    value: initialValue,
    setHasUnsavedChanges,
    options,
}: BooleanSelectProps) {
    const context = useContext(ProgramContext);
    if (!context) {
        throw new Error('TableCell must be used within a Provider');
    }
    const { target } = context;

    const [value, setValue] = useState<string>(initialValue);
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleIconChange = async (newValue: string) => {
        setValue(newValue);
        setPopoverOpen(false);

        const formData = new FormData();
        if (programId) {
            formData.append('id', programId);
        }
        formData.append(columnKey, newValue);
        if (target) {
            const response = await updateProgram(formData, target);
            setHasUnsavedChanges(false);
            if (!response.success) {
                console.error('Failed to update program:', response.error);
            } else {
                console.log('Program updated successfully:', response.data);
            }
        }
    };

    const renderIconAndLabel = (option: { value: string, label: string }) => {
        switch (columnKey) {
            case 'photographPermission':
                return option.value === "可" ? <><Circle />{option.label}</> : option.value === "不可" ? <><X />{option.label}</> : <><IconQuestion />{option.label}</>;
            case 'isDrinkAvailable':
                return option.value === "販売有り" ? <><Circle />{option.label}</> : option.value === "販売無し" ? <><X />{option.label}</> : <><IconQuestion />{option.label}</>;
            case 'isEcoTrayUsed':
                return option.value === "利用有り" ? <><Circle />{option.label}</> : option.value === "利用無し" ? <><X />{option.label}</> : <><IconQuestion />{option.label}</>;
            case 'isEventTicketAvailable':
                return option.value === "チケット有り" ? <><Circle />{option.label}</> : option.value === "チケット無し" ? <><X />{option.label}</> : <><IconQuestion />{option.label}</>;
            case 'isReservationRequired':
                return option.value === "整理券有り" ? <><Circle />{option.label}</> : option.value === "整理券無し" ? <><X />{option.label}</> : <><IconQuestion />{option.label}</>;
            case 'isGoodsAvailable':
                return option.value === "販売有り" ? <><Circle />{option.label}</> : option.value === "販売無し" ? <><X />{option.label}</> : <><IconQuestion />{option.label}</>;
            default:
                return <><IconQuestion />{option.label}</>;
        }
    };

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`cursor-pointer rounded mx-auto hover:border-gray-600 transition ${value === "不明" ? "p-[5px]" : "p-2"}`}
                >
                    {renderIconAndLabel({ value, label: options.find(option => option.value === value)?.label || '不明' })}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                <div className="flex justify-around items-center gap-3">
                    {options.map(option => (
                        <Button
                            key={option.value}
                            variant="ghost"
                            onClick={() => handleIconChange(option.value)}
                            className='flex justify-center items-center gap-3 py-1 px-2'
                        >
                            {renderIconAndLabel(option)}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

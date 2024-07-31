// @filename: /app/components/items/BooleanSelect.tsx
'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Circle, X } from 'lucide-react';
import IconQuestion from '../../../icons/IconQuestion';

type BooleanSelectProps = {
    column: { label: string, key: string };
    value: string;
    options: { value: string, label: string }[];
    onInputChange?: (key: string, value: string) => void;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
};

export default function BooleanSelect({
    column,
    value,
    options,
    onInputChange,
    onChange,
    onBlur
}: BooleanSelectProps) {
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

    const handleIconChange = (newValue: string) => {
        if (onInputChange && column) {
            onInputChange(column.key, newValue);
        }
        if (onChange && onBlur) {
            onChange({ target: { value: newValue } } as React.ChangeEvent<HTMLSelectElement>);
            onBlur({ target: { value: newValue } } as React.FocusEvent<HTMLSelectElement>);
        }
        setPopoverOpen(false);
    };

    const renderIconAndLabel = (option: { value: string, label: string }) => {
        switch (column.key) {
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
        <div className='w-full'>
            {column && <label className="block mb-1">{column.label}</label>}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={`cursor-pointer rounded mx-auto hover:border-gray-600 transition ${value === "不明" ? "p-[5px]" : "p-2"}`}
                    >
                        {renderIconAndLabel(options.find(option => option.value === value) || { value: "不明", label: "不明" })}
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
        </div>
    );
}

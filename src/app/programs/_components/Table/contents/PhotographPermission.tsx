// src/components/contents/PhotographPermission.tsx
'use client';

import { useContext, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Circle, X } from 'lucide-react';
import updateProgram from '@/actions/programs/updateProgram';
import IconQuestion from '../../icons/IconQuestion';
import ProgramContext from '@/app/programs/contexts/ProgramContext';

type PhotographPermissionProps = {
    programId: string;
    value: UnionProgram['photographPermission'];
    setHasUnsavedChanges: (value: boolean) => void;
};

export default function PhotographPermission({
    programId,
    value: initialValue,
    setHasUnsavedChanges,
}: PhotographPermissionProps) {
    const context = useContext(ProgramContext);
    if (!context) {
        throw new Error('TableCell must be used within a Provider');
    }
    const { target } = context;

    const [value, setValue] = useState<string>(initialValue);
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

    const handleIconChange = async (newValue: string) => {
        setValue(newValue);
        setPopoverOpen(false);

        const formData = new FormData();
        if (programId) {
            formData.append('id', programId);
        }
        formData.append('photographPermission', newValue);
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

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`cursor-pointer rounded mx-auto hover:border-gray-600 transition ${value === "不明" ? "p-[5px]" : "p-2"}`}
                >
                    {value === "可" && <Circle />}
                    {value === "不可" && <X />}
                    {value === "不明" && <IconQuestion />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                <div className="flex justify-around items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => handleIconChange("可")}
                        className='flex justify-center items-center gap-3 py-1 px-2'
                    >
                        <Circle />
                        撮影可
                    </Button>
                    |
                    <Button
                        variant="ghost"
                        onClick={() => handleIconChange("不可")}
                        className='flex justify-center items-center gap-3 py-1 px-2'
                    >
                        <X />
                        撮影不可
                    </Button>
                    |
                    <Button
                        variant="ghost"
                        onClick={() => handleIconChange("不明")}
                        className='flex justify-center items-center gap-3 py-1 px-2'
                    >
                        <IconQuestion />
                        不明
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
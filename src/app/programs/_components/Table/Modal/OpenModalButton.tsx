// @filename: /components/AddRowButton.tsx
'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PlusIcon, X } from "lucide-react";
import AddRowModal from './AddRowModal';

type AddRowButtonProps = {
    participants: Participant[];
}

type ButtonComponentProps = {
    handleModalOpen: (target: Target) => void;
    target: Target;
}

const ButtonComponent = ({ handleModalOpen, target }: ButtonComponentProps) => {
    let targetName;
    switch (target) {
        case 'participant':
            targetName = '団体';
            break;
        case 'booth':
            targetName = '模擬店';
            break;
        case 'outstage':
            targetName = '屋外ステージ';
            break;
        case 'room':
            targetName = '教室';
            break;
        default:
            return;
    }
    return (
        <Button
            variant='ghost'
            className="flex justify-start items-center gap-3 bg-white w-full text-gray-700 border border-transparent hover:border-gray-700"
            onClick={() => handleModalOpen(target)}
        >
            <PlusIcon />
            {target === 'participant' ? (
                <span>{targetName}を追加する</span>
            ) : (
                <span>{targetName}企画を追加する</span>
            )}
        </Button>
    )
};

export default function OpenModalButton({ participants }: AddRowButtonProps) {
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [target, settarget] = useState<Target>('participant');

    const handleModalOpen = (target: Target) => {
        setIsPopoverOpen(false);
        setIsModalOpen(true);
        settarget(target);
        document.body.style.overflow = "hidden"; // スクロールを止める
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        document.body.style.overflow = ""; // スクロールを元に戻す
    };

    return (
        <>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    {
                        isPopoverOpen ? (
                            <Button
                                className="mr-12 flex justify-center items-center gap-3 shadow-md bg-white text-gray-700 border hover:bg-gray-100 hover:border-gray-600"
                                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                            >
                                <X />
                                <span>閉じる</span>
                            </Button>
                        ) : (
                            <Button
                                className="flex justify-center items-center gap-3 shadow-md bg-white text-gray-700 border hover:bg-gray-100 hover:border-gray-600"
                                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                            >
                                <PlusIcon />
                                <span>データを追加する</span>
                            </Button>
                        )
                    }
                </PopoverTrigger>
                <PopoverContent className="w-fit mt-4">
                    <div className="flex flex-col justify-around items-center gap-3">
                        <ButtonComponent handleModalOpen={handleModalOpen} target='participant' />
                        <hr className='bg-black w-full' />
                        <div className='space-y-2'>
                            <ButtonComponent handleModalOpen={handleModalOpen} target='booth' />
                            <ButtonComponent handleModalOpen={handleModalOpen} target='outstage' />
                            <ButtonComponent handleModalOpen={handleModalOpen} target='room' />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            {isModalOpen && <AddRowModal onClose={handleModalClose} participants={participants} target={target} />}
        </>
    );
}

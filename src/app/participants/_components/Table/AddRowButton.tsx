// @filename: /components/AddRowButton.tsx
'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AddRowModal from './AddRowModal';

export default function AddRowButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
        document.body.style.overflow = "hidden"; // スクロールを止める
    };

    const handleClose = () => {
        setIsModalOpen(false);
        document.body.style.overflow = ""; // スクロールを元に戻す
    };

    return (
        <>
            <Button
                variant="default"
                className="flex justify-center items-center gap-3 mx-auto mt-6"
                onClick={handleClick}
            >
                <PlusIcon />
                <span>行を追加する</span>
            </Button>
            {isModalOpen && <AddRowModal onClose={handleClose} />}
        </>
    );
}

// src/components/ProgramImage.tsx
'use client'

import createProgramImage from "@/actions/storages/programImages/createProgramImage";
import deleteProgramImage from "@/actions/storages/programImages/deleteProgramImage";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";

type ProgramImageProps = {
    programId: string;
    participantId: string;
    initialImageUrl: string;
    target: 'booth' | 'outstage' | 'room';
    setRowHeight: (height: number) => void;
};

export default function ProgramImage({ programId, participantId, initialImageUrl, target, setRowHeight }: ProgramImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
            const formData = new FormData();
            formData.append('id', programId);
            formData.append('file', selectedFile);

            setLoading(true);

            const response = await createProgramImage(formData, target);

            console.log(response);

            if (response.success) {
                setImageUrl(response.url!);
                setError(null);
            } else {
                setError('Failed to upload image');
            }

            setLoading(false);
        }
    };

    const handleImageButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handleImageDelete = async () => {
        const fileName = imageUrl?.split('/').pop();
        if (!fileName) return;

        const response = await deleteProgramImage(programId, fileName, target);

        if (response.success) {
            setImageUrl(null);
            setError(null);
        } else {
            setError('Error deleting image');
        }
    };

    const recalculateRowHeight = () => {
        const cellElement = document.getElementById(`social-media-cell-${participantId}`);
        if (cellElement) {
            const cellHeight = cellElement.offsetHeight;
            setRowHeight(cellHeight);
        }
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleImageChange}
                className="hidden"
            />
            {!loading && !imageUrl && (
                <Button
                    variant="outline"
                    type='button'
                    className="p-2 mx-auto flex justify-center items-center gap-3 hover:border-gray-600"
                    onClick={handleImageButtonClick}
                >
                    <PlusIcon />
                    画像を追加する
                </Button>
            )}
            {loading ? (
                <div className='flex flex-col gap-4 items-center'>
                    <div className="w-[150px] aspect-square bg-gray-300 animate-pulse mt-4" />
                    <Button
                        variant="outline"
                        className="group cursor-pointer rounded mx-auto hover:border-red-600 hover:bg-transparent transition p-2"
                        type='button'
                        onClick={handleImageDelete}
                    >
                        <Trash2 className="group-hover:text-red-600" />
                    </Button>
                </div>
            ) : (
                imageUrl && (
                    <div className='flex flex-col gap-4 items-center'>
                        <Image
                            src={imageUrl}
                            alt="Uploaded Image"
                            width={200}
                            height={200}
                            className='w-[150px] aspect-square object-cover border-2 border-gray-700'
                        />
                        <Button
                            variant="outline"
                            className="group cursor-pointer rounded hover:border-red-600 hover:bg-transparent transition p-2"
                            type='button'
                            onClick={handleImageDelete}
                        >
                            <Trash2 className="group-hover:text-red-600" />
                        </Button>
                    </div>
                )
            )}
            {error && <div className="text-red-600">{error}</div>}
        </>
    )
}

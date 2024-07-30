// src/components/ProgramImage.tsx
'use client';

import createProgramImage from "@/actions/storages/programImages/createProgramImage";
import deleteProgramImage from "@/actions/storages/programImages/deleteProgramImage";
import ProgramContext from "@/app/programs/contexts/ProgramContext";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, RefObject, useContext, useEffect, useRef, useState } from "react";

type ProgramImageProps = {
    programId: string;
    participantId: string;
    imageUrl: string;
    tableCellRef: RefObject<HTMLDivElement>;
};

export default function ProgramImage({ programId, participantId, imageUrl: initialImageUrl, tableCellRef }: ProgramImageProps) {
    const context = useContext(ProgramContext);
    if (!context) {
        throw new Error('TableCell must be used within a Provider');
    }
    const { target, setRowHeight } = context;

    const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [prevHeight, setPrevHeight] = useState<number>(0);

    useEffect(() => {
        if (tableCellRef.current) {
            const currentHeight = tableCellRef.current.offsetHeight;
            setRowHeight(participantId, currentHeight);
        }
    }, [setRowHeight, participantId, imageUrl, tableCellRef]);

    const handleImageCreate = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
            const formData = new FormData();
            formData.append('id', programId);
            formData.append('file', selectedFile);

            setLoading(true);

            const response = await createProgramImage(formData, target);

            if (response.success) {
                setImageUrl(response.url!);
                setError(null);
                if (tableCellRef.current) {
                    const currentHeight = tableCellRef.current.offsetHeight;
                    setRowHeight(participantId, currentHeight);
                    setPrevHeight(currentHeight);
                }
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

        let response;
        if (target !== 'participant') {
            response = await deleteProgramImage(programId, fileName, target);
        }

        if (response!.success) {
            setImageUrl(null);
            setError(null);
            if (tableCellRef.current) {
                const currentHeight = tableCellRef.current.offsetHeight;
                setRowHeight(participantId, currentHeight, prevHeight);
                setPrevHeight(prevHeight / 2);
            }
        } else {
            setError('Error deleting image');
        }
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleImageCreate}
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
    );
}

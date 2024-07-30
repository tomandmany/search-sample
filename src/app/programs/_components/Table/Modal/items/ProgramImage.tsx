// src/components/items/ProgramImage.tsx
'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2 } from "lucide-react";
import Image from "next/image";

type ProgramImageProps = {
    onUploadSuccess: (file: File) => void;
    target: Target;
};

export default function ProgramImage({ onUploadSuccess }: ProgramImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
            setLoading(true);
            setImageUrl(URL.createObjectURL(selectedFile));
            onUploadSuccess(selectedFile);
            setLoading(false);
        }
    };

    return (
        <div className='w-full'>
            <label className="block mb-1">企画イメージ図</label>
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
                    className="p-2 flex justify-center items-center gap-3 hover:border-gray-600"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <PlusIcon />
                    画像を追加する
                </Button>
            )}
            {loading ? (
                <div className='flex flex-col gap-4 items-center'>
                    <div className="w-[150px] aspect-square bg-gray-300 animate-pulse mt-4" />
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
                            onClick={() => {
                                setImageUrl(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                        >
                            <Trash2 className="group-hover:text-red-600" />
                        </Button>
                    </div>
                )
            )}
            {error && <div className="text-red-600">{error}</div>}
        </div>
    );
}

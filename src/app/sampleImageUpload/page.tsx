// @filename: /app/sampleImageUpload/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import createProgramImages from '@/actions/storages/programImages/createProgramImage';
import { getPrograms } from '@/data/programs';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import deleteProgramImage from '@/actions/storages/programImages/deleteProgramImage';

export default function Page() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            const programs = await getPrograms();
            setPrograms(programs);
        };

        fetchPrograms();
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
            const programId = programs[0]?.id; // 適切なプログラムIDを使用してください
            if (!programId) {
                return;
            }

            const formData = new FormData();
            formData.append('id', programId);
            formData.append('file', selectedFile);

            setLoading(true); // アップロード開始時にローディング状態に設定

            const response = await createProgramImages(formData);

            console.log(response); // レスポンスをログ出力

            if (response.success) {
                setImageUrl(response.url!);
            }

            setLoading(false); // アップロード終了時にローディング状態を解除
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDelete = async () => {
        const fileName = imageUrl?.split('/').pop();
        if (!fileName) return;

        const response = await deleteProgramImage(programs[0].id, fileName);

        if (response.success) {
            setImageUrl(null);
        } else {
            console.error('Error deleting image:', response.error);
        }
    };

    return (
        <main className="min-w-full min-h-screen flex flex-col justify-center items-center">
            {!loading && !imageUrl && (
                <>
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        type='button'
                        className="p-2 flex justify-center items-center gap-3 hover:border-gray-600"
                        onClick={handleButtonClick}
                    >
                        画像を追加する
                    </Button>
                </>
            )}
            {loading ? (
                <div className="w-48 h-48 bg-gray-300 animate-pulse mt-4"></div>
            ) : (
                imageUrl && (
                    <>
                        <Image
                            src={imageUrl!}
                            alt="Uploaded Image"
                            width={200}
                            height={200}
                        />
                        <Button
                            variant="outline"
                            type='button'
                            className="p-2 flex justify-center items-center gap-3 hover:border-gray-600 mt-4"
                            onClick={handleDelete}
                        >
                            画像を削除する
                        </Button>
                    </>
                )
            )}
        </main>
    );
}

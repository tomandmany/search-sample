// @filename: /components/AddRowModal.tsx
'use client'

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from 'next/navigation';
import createParticipant from '@/actions/participants/createParticipant';

type AddRowModalProps = {
    onClose: () => void;
};

type FormDataType = {
    name: string;
    ruby: string;
};

export default function AddRowModal({ onClose }: AddRowModalProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<FormDataType>({
        name: '',
        ruby: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const programFormData = new FormData();
        programFormData.append('name', formData.name);
        programFormData.append('ruby', formData.ruby);

        const response = await createParticipant(programFormData);
        if (response.success) {
            router.refresh(); // ページをリロードして新しい行を反映
            resetForm();
            onClose();
        } else {
            console.error('Failed to create program:', response.error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            ruby: '',
        });
    };

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className='w-full h-full fixed' onClick={onClose} />
            <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto absolute">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">新しい団体を追加</h2>
                    <Button variant="ghost" onClick={onClose} className='p-2'>
                        <X />
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">団体名</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">フリガナ</label>
                        <input
                            type="text"
                            name="ruby"
                            value={formData.ruby}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" variant="default">
                            追加
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

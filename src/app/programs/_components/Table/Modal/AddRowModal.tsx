// app/components/AddRowModal.tsx

// ファイルのパス
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { boothProgramColumns, outstageProgramColumns, participantColumns, roomProgramColumns } from '@/data/columns';
import ParticipantSelect from './items/ParticipantSelect';
import InputItem from './items/InputItem';
import ProgramImage from './items/ProgramImage';
import SocialMedia from './items/SocialMedia';
import createParticipant from '@/actions/participants/createParticipant';
import createProgram from '@/actions/programs/createProgram';
import createProgramImage from '@/actions/storages/programImages/createProgramImage';
import createParticipantSocialMedia from '@/actions/participantSocialMedia/createParticipantSocialMedia';

type AddRowModalProps = {
    onClose: () => void;
    participants: Participant[];
    target: Target;
};

export default function AddRowModal({ onClose: handleModalClose, participants, target }: AddRowModalProps) {
    const [columns, setColumns] = useState<{ label: string, key: string }[]>([]);
    const [targetName, setTargetName] = useState<string>('');
    const [inputValues, setInputValues] = useState<{ [key: string]: string | File | { type: string, url: string } }>({});
    const [programImageFile, setProgramImageFile] = useState<File | null>(null);

    useEffect(() => {
        switch (target) {
            case 'participant':
                setTargetName('団体');
                setColumns(participantColumns);
                break;
            case 'booth':
                setTargetName('模擬店');
                setColumns(boothProgramColumns);
                break;
            case 'outstage':
                setTargetName('屋外ステージ');
                setColumns(outstageProgramColumns);
                break;
            case 'room':
                setTargetName('教室');
                setColumns(roomProgramColumns);
                break;
            default:
                return;
        }
    }, [target]);

    const handleInputChange = (key: string, value: string | File | { type: string, url: string }) => {
        setInputValues({
            ...inputValues,
            [key]: value
        });
    };

    const handleParticipantSelect = (participantName: string) => {
        setInputValues({
            ...inputValues,
            participantName
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        columns
            .filter(column => column.key !== 'programImage' && column.key !== 'socialMedia')
            .forEach((column) => {
                formData.append(column.key, inputValues[column.key] as string | Blob);
            });

        if (target !== 'participant') {
            const participant = participants.find(participant => participant.participantName === inputValues['participantName']);
            if (participant) {
                formData.append('participantId', participant.id);
            }
        }

        if (programImageFile) {
            const imageFormData = new FormData();
            imageFormData.append('file', programImageFile);

            const imageResponse = await createProgramImage(imageFormData, target);
            if (imageResponse.success && imageResponse.url) {
                formData.append('programImage', imageResponse.url);
            } else {
                console.error('Failed to upload image:', imageResponse.error);
                return;
            }
        }

        let response;
        if (target === 'participant') {
            response = await createParticipant(formData);

            if (response.success && inputValues.socialMedia) {
                const socialMedia = inputValues.socialMedia as { type: string, url: string };
                const socialMediaFormData = new FormData();
                socialMediaFormData.append('socialMediaModelId', socialMedia.type);
                socialMediaFormData.append('participantId', response.data?.id || '');
                socialMediaFormData.append('url', socialMedia.url);

                const socialMediaResponse = await createParticipantSocialMedia(socialMediaFormData, target);
                if (!socialMediaResponse.success) {
                    console.error('Failed to create social media:', socialMediaResponse.error);
                }
            }
        } else {
            response = await createProgram(formData, target);
        }

        if (!response.success) {
            console.error('Failed to submit:', response.error);
        } else {
            handleModalClose();
        }
    };

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className='w-full h-full fixed' onClick={handleModalClose} />
            <div className="bg-white rounded-lg p-6 w-96 relative">
                <div className="flex justify-between items-center absolute top-0 left-0 bg-white border min-w-full px-4 py-6 z-10">
                    <h2 className="text-xl font-bold">新しい{targetName}を追加</h2>
                    <Button variant="ghost" onClick={handleModalClose} className='p-2 border border-transparent hover:border-gray-600'>
                        <X />
                    </Button>
                </div>
                <form className="flex flex-col gap-10 items-end overflow-y-auto max-h-[80vh] pt-24 px-6 -mx-6" onSubmit={handleSubmit}>
                    {target !== 'participant' && (
                        <div className='w-full'>
                            <label className="block mb-1">団体名</label>
                            <ParticipantSelect participants={participants} setInputValue={handleParticipantSelect} />
                        </div>
                    )}
                    {columns
                        .filter(column => column.key !== 'programImage' && column.key !== 'socialMedia')
                        .map((column, index) => (
                            <InputItem key={`${column.key}-${index}`} column={column} onInputChange={handleInputChange} />
                        ))}
                    {target !== 'participant' && (
                        <ProgramImage onUploadSuccess={setProgramImageFile} target={target} />
                    )}
                    {/* {target !== 'participant' ? (
                        <ProgramImage onUploadSuccess={setProgramImageFile} target={target} />
                    ) : (
                        <SocialMedia onInputChange={handleInputChange} />
                    )} */}
                    <Button
                        type="submit"
                        variant="default"
                        className='ml-mr-0'
                    >
                        追加
                    </Button>
                </form>
            </div>
        </div>,
        document.body
    );
}

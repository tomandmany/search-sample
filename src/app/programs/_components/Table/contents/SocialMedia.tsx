// @filename: /src/components/contents/SocialMedia.tsx
'use client';

import { useContext, useState, useEffect, useRef, RefObject, Dispatch, SetStateAction } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ExternalLink, PlusIcon, Rss, Trash2 } from "lucide-react";
import { FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import createParticipantSocialMedia from '@/actions/participantSocialMedia/createParticipantSocialMedia';
import updateParticipantSocialMedia from '@/actions/participantSocialMedia/updateParticipantSocialMedia';
import deleteParticipantSocialMedia from '@/actions/participantSocialMedia/deleteParticipantSocialMedia';
import getSocialMediaModels from '@/data/socialMediaModels';
import { z } from 'zod';
import ProgramContext from '@/app/programs/contexts/ProgramContext';

type SocialMediaProps = {
    participantId: string;
    participantSocialMedias: ParticipantSocialMedia[];
    tableCellRef: RefObject<HTMLDivElement>;
    onParticipantSocialMediaChanges: Dispatch<SetStateAction<ParticipantSocialMedia[]>>;
};

type NewSocialMedia = {
    id: string;
    name: string;
    url: string;
};

const newSocialMediaSchema = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().min(1, 'URL cannot be empty')
});

const iconMap: { [key: string]: React.ReactNode } = {
    x: <FaXTwitter />,
    instagram: <FaInstagram />,
    tiktok: <FaTiktok />,
    note: <Image src={"/note.svg"} alt='note' width={13} height={13} className='ml-[2px] mr-[1px]' />,
    blog: <Rss className='w-4' />,
};

export default function SocialMedia({ participantId, participantSocialMedias, tableCellRef, onParticipantSocialMediaChanges: handleParticipantSocialMediaChanges }: SocialMediaProps) {
    const context = useContext(ProgramContext);
    if (!context) {
        throw new Error('TableCell must be used within a Provider');
    }
    const { target, setRowHeight } = context;

    const [newSocialMedia, setNewSocialMedia] = useState<Partial<NewSocialMedia>>({ id: '', name: '', url: '' });
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
    const [socialMediaModels, setSocialMediaModels] = useState<SocialMediaModel[]>([]);
    const [error, setError] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchSocialMediaModels() {
            const models = await getSocialMediaModels();
            setSocialMediaModels(models);
        }

        fetchSocialMediaModels();
    }, []);

    useEffect(() => {
        if (tableCellRef.current) {
            const currentHeight = tableCellRef.current.offsetHeight;
            setRowHeight(participantId, currentHeight);
        }
    }, [participantId, setRowHeight, tableCellRef]);

    const handleSocialMediaTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedModel = socialMediaModels.find(model => model.id === event.target.value);
        setNewSocialMedia({ ...newSocialMedia, id: event.target.value, name: selectedModel?.name || '' });
    };

    const handleSocialUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewSocialMedia({ ...newSocialMedia, url: event.target.value });
    };

    const handleCreateParticipantSocialMedia = async () => {
        const validationResult = newSocialMediaSchema.safeParse(newSocialMedia);
        if (!validationResult.success) {
            setError('URL cannot be empty');
            return;
        }

        const currentSocialMediaModel = socialMediaModels.find((socialMedia) => socialMedia.id === newSocialMedia.id);

        if (!participantId || !currentSocialMediaModel || !newSocialMedia.url) {
            setError('Invalid input data');
            return;
        }

        const socialMediaFormData = new FormData();
        socialMediaFormData.append('participantId', participantId);
        socialMediaFormData.append('socialMediaModelId', currentSocialMediaModel.id);
        socialMediaFormData.append('url', newSocialMedia.url);

        const response = await createParticipantSocialMedia(socialMediaFormData, target);
        if (response.success && response.data) {
            const newSocialMediaEntry: ParticipantSocialMedia = {
                id: response.data.id!,
                participantId: response.data.participantId!,
                socialMediaModelId: response.data.socialMediaModelId!,
                url: response.data.url!,
                createdAt: response.data.createdAt!,
            };

            handleParticipantSocialMediaChanges(prev => {
                if (prev.some(sm => sm.id === newSocialMediaEntry.id)) {
                    return prev;
                }
                return [...prev, newSocialMediaEntry];
            });

            setNewSocialMedia({ id: '', name: '', url: '' });
            setPopoverOpen(false);
            setError(null);
            if (tableCellRef.current) {
                const currentHeight = tableCellRef.current.offsetHeight;
                setRowHeight(participantId, currentHeight);
            }
        } else {
            setError('Failed to create socialMedia');
            console.error('Failed to create socialMedia:', response.error);
        }
    };

    const handleUpdateParticipantSocialMedia = async (socialMediaId: string, newUrl: string) => {
        if (!newUrl) {
            setError('URL cannot be empty');
            return;
        }
        const formData = new FormData();
        formData.append('id', socialMediaId);
        formData.append('url', newUrl);
        const response = await updateParticipantSocialMedia(formData, target);
        if (response.success) {
            handleParticipantSocialMediaChanges(prev =>
                prev.map(sm => sm.id === socialMediaId ? { ...sm, url: newUrl } : sm)
            );
            setError(null);
        } else {
            setError('Failed to update socialMedia');
            console.error('Failed to update socialMedia:', response.error);
        }
    };

    const handleDeleteParticipantSocialMedia = async (socialMediaId: string) => {
        const response = await deleteParticipantSocialMedia(socialMediaId, target);
        if (response.success) {
            handleParticipantSocialMediaChanges(prev => prev.filter(sm => sm.id !== socialMediaId));
            setError(null);
            if (tableCellRef.current) {
                const currentHeight = tableCellRef.current.offsetHeight;
                setRowHeight(participantId, currentHeight);
            }
        } else {
            setError('Failed to delete socialMedia');
            console.error('Failed to delete socialMedia:', response.error);
        }
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if ((event.metaKey && event.key === 'Enter') || (event.ctrlKey && event.key === 'Enter')) {
            const target = event.target as HTMLInputElement;
            target.blur();
        }
    };

    const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const newUrl = target.value;
        const socialMediaId = target.getAttribute('data-id')!;
        await handleUpdateParticipantSocialMedia(socialMediaId, newUrl);
    };

    return (
        <div className="flex flex-col gap-6 m-2" ref={ref}>
            {participantSocialMedias.length > 0 && (
                <div className="flex flex-col gap-2">
                    {participantSocialMedias.map((participantSocialMedia) => {
                        const socialMediaModel = socialMediaModels.find((model) => model.id === participantSocialMedia.socialMediaModelId);
                        return (
                            <div key={participantSocialMedia.id} id={participantSocialMedia.id} className="flex flex-col">
                                <div className="flex items-center justify-center">
                                    {iconMap[socialMediaModel?.name?.toLowerCase() || '']}
                                    <span className='ml-2'>:</span>
                                    <input
                                        type="text"
                                        value={participantSocialMedia.url ?? ''}
                                        data-id={participantSocialMedia.id}
                                        onChange={(e) => handleParticipantSocialMediaChanges(prev =>
                                            prev.map(sm => sm.id === participantSocialMedia.id ? { ...sm, url: e.target.value } : sm)
                                        )}
                                        onBlur={handleBlur}
                                        onKeyDown={handleKeyDown}
                                        className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text"
                                    />
                                    {participantSocialMedia.url && !error && (
                                        <>
                                            <Button variant="ghost" className='p-2' type='button'>
                                                <a href={participantSocialMedia.url} target='_blank' rel='noreferrer noopener' className='text-[#0000ee] hover:underline ml-1'>
                                                    <ExternalLink className='w-4' />
                                                </a>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="p-2 w-[36px]"
                                                type='button'
                                                onClick={() => handleDeleteParticipantSocialMedia(participantSocialMedia.id)}
                                            >
                                                <Trash2 className="text-red-600" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                                {error && <div className="text-red-600">{error}</div>}
                            </div>
                        );
                    })}
                </div>
            )}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                {participantSocialMedias.length < 5 &&
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="p-2 flex justify-center items-center gap-3 hover:border-gray-600 max-w-fit mx-auto">
                            <PlusIcon />
                            SNSを追加する
                        </Button>
                    </PopoverTrigger>
                }
                <PopoverContent className="w-fit p-4">
                    <div className="flex flex-col gap-3">
                        <select
                            value={newSocialMedia.id}
                            onChange={handleSocialMediaTypeChange}
                            className='cursor-pointer rounded px-2 py-1 hover:bg-gray-200 border'
                        >
                            <option value="">選択してください</option>
                            {socialMediaModels
                                .filter((model) => !participantSocialMedias.some(socialMedia => socialMedia.socialMediaModelId === model.id))
                                .map((model) => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                        </select>
                        <input
                            type="text"
                            value={newSocialMedia.url ?? ''}
                            onChange={handleSocialUrlChange}
                            placeholder="リンクを入力"
                            className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 border"
                        />
                        {error && <div className="text-red-600">{error}</div>}
                        <Button onClick={handleCreateParticipantSocialMedia} className="self-end">
                            追加
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

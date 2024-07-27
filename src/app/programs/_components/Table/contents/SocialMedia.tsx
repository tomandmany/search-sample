// src/components/contents/SocialMedia.tsx
import { useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ExternalLink, PlusIcon, Rss, Trash2 } from "lucide-react";
import { FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { ProgramContextType } from '@/app/programs/contexts/ProgramContext';
import createParticipantSocialMedia from '@/actions/participantSocialMedia/createParticipantSocialMedia';
import updateParticipantSocialMedia from '@/actions/participantSocialMedia/updateParticipantSocialMedia';
import deleteParticipantSocialMedia from '@/actions/participantSocialMedia/deleteParticipantSocialMedia';
import getSocialMediaModels from '@/data/socialMediaModels';

type SocialMediaProps = {
    participantId: string;
    programContext: React.Context<ProgramContextType | undefined>;
    department?: 'booth' | 'outstage' | 'room';
    currentParticipantSocialMedias: ParticipantSocialMedia[];
    setCurrentParticipantSocialMedias: Dispatch<SetStateAction<ParticipantSocialMedia[]>>;
    setRowHeight: (height: number) => void;
};

type NewSocialMedia = {
    id: string;
    name: string;
    url: string;
};

const iconMap: { [key: string]: React.ReactNode } = {
    x: <FaXTwitter />,
    instagram: <FaInstagram />,
    tiktok: <FaTiktok />,
    note: <Image src={"/note.svg"} alt='note' width={13} height={13} className='ml-[2px] mr-[1px]' />,
    blog: <Rss className='w-4' />,
};

export default function SocialMedia({ participantId, programContext, department, currentParticipantSocialMedias, setCurrentParticipantSocialMedias, setRowHeight }: SocialMediaProps) {
    const [newSocialMedia, setNewSocialMedia] = useState<Partial<NewSocialMedia>>({ id: '', name: '', url: '' });
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
    const [socialMediaModels, setSocialMediaModels] = useState<SocialMediaModel[]>([]);

    const context = useContext(programContext);
    if (!context) {
        throw new Error('SocialMedia must be used within a Provider');
    }
    const { participantSocialMedias } = context;

    useEffect(() => {
        const filteredParticipantSocialMedias = participantSocialMedias.filter(
            (socialMedia) => socialMedia.participantId === participantId
        );

        setCurrentParticipantSocialMedias(filteredParticipantSocialMedias);
    }, [participantId, participantSocialMedias, setCurrentParticipantSocialMedias]);

    useEffect(() => {
        async function fetchSocialMediaModels() {
            const models = await getSocialMediaModels();
            setSocialMediaModels(models);
        }

        fetchSocialMediaModels();
    }, []);

    useEffect(() => {
        console.log('currentParticipantSocialMedias updated:', currentParticipantSocialMedias);
    }, [currentParticipantSocialMedias]);

    const handleSocialMediaTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedModel = socialMediaModels.find(model => model.id === event.target.value);
        setNewSocialMedia({ ...newSocialMedia, id: event.target.value, name: selectedModel?.name || '' });
    };

    const handleSocialUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewSocialMedia({ ...newSocialMedia, url: event.target.value });
    };

    const handleCreateParticipantSocialMedia = async () => {
        const currentSocialMediaModel = socialMediaModels.find((socialMedia) => socialMedia.id === newSocialMedia.id);

        if (!participantId || !currentSocialMediaModel || !newSocialMedia.url) {
            console.error('Invalid input data');
            return;
        }

        const socialMediaFormData = new FormData();
        socialMediaFormData.append('participantId', participantId);
        socialMediaFormData.append('channelModelId', currentSocialMediaModel.id);
        socialMediaFormData.append('url', newSocialMedia.url);
        if (department) {
            const response = await createParticipantSocialMedia(socialMediaFormData, department);
            if (response.success && response.data) {
                const newSocialMediaEntry: ParticipantSocialMedia = {
                    id: response.data.id!,
                    participantId: response.data.participantId!,
                    channelModelId: response.data.channelModelId!,
                    url: response.data.url!,
                    createdAt: response.data.createdAt!,
                };
                setCurrentParticipantSocialMedias(prev => [...prev, newSocialMediaEntry]);
                setNewSocialMedia({ id: '', name: '', url: '' });
                setPopoverOpen(false);
                recalculateRowHeight([...currentParticipantSocialMedias, newSocialMediaEntry]);
            } else {
                console.error('Failed to create channel:', response.error);
            }
        }
    };

    const handleUpdateParticipantSocialMedia = async (channelId: string, newUrl: string) => {
        const formData = new FormData();
        formData.append('id', channelId);
        formData.append('url', newUrl);
        if (department) {
            const response = await updateParticipantSocialMedia(formData, department);
            if (response.success) {
                setCurrentParticipantSocialMedias(prev =>
                    prev.map(sm => sm.id === channelId ? { ...sm, url: newUrl } : sm)
                );
                recalculateRowHeight(currentParticipantSocialMedias);
            } else {
                console.error('Failed to update channel:', response.error);
            }
        }
    };

    const handleDeleteParticipantSocialMedia = async (channelId: string) => {
        if (department) {
            const response = await deleteParticipantSocialMedia(channelId, department);
            if (response.success) {
                setCurrentParticipantSocialMedias(prev => {
                    const updated = prev.filter(sm => sm.id !== channelId);
                    recalculateRowHeight(updated);
                    return updated;
                });
            } else {
                console.error('Failed to delete channel:', response.error);
            }
        }
    };

    const recalculateRowHeight = (socialMedias: ParticipantSocialMedia[]) => {
        // 仮に、すべての要素の高さを再計算するロジック
        const maxHeight = socialMedias.reduce((max, sm) => {
            const element = document.getElementById(sm.id);
            if (element) {
                return Math.max(max, element.offsetHeight);
            }
            return max;
        }, 0);
        setRowHeight(maxHeight);
    };

    return (
        <div
            className="flex flex-col gap-6 m-2"
        >
            {currentParticipantSocialMedias.length > 0 && (
                <div className="flex flex-col gap-2">
                    {currentParticipantSocialMedias.map((participantSocialMedia, index) => {
                        const socialMediaModel = socialMediaModels.find((model) => model.id === participantSocialMedia.channelModelId);
                        return (
                            <div key={index} id={participantSocialMedia.id} className="flex justify-between items-center">
                                <span className="flex items-center justify-center">
                                    {iconMap[socialMediaModel?.name?.toLowerCase() || '']}
                                    <span className='ml-2'>:</span>
                                    <input
                                        type="text"
                                        value={participantSocialMedia.url ?? ''}
                                        onChange={(e) => setCurrentParticipantSocialMedias(prev =>
                                            prev.map(sm => sm.id === participantSocialMedia.id ? { ...sm, url: e.target.value } : sm)
                                        )}
                                        onBlur={(e) => handleUpdateParticipantSocialMedia(participantSocialMedia.id, e.target.value)}
                                        className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text"
                                    />
                                    {participantSocialMedia.url && (
                                        <Button variant="ghost" className='p-2' type='button'>
                                            <a href={participantSocialMedia.url} target='_blank' rel='noreferrer noopener' className='text-[#0000ee] hover:underline ml-1'>
                                                <ExternalLink className='w-4' />
                                            </a>
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        className="p-2 w-[36px]"
                                        type='button'
                                        onClick={() => handleDeleteParticipantSocialMedia(participantSocialMedia.id)}
                                    >
                                        <Trash2 className="text-red-600" />
                                    </Button>
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                {currentParticipantSocialMedias.length < 5 &&
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
                                .filter((model) => !currentParticipantSocialMedias.some(channel => channel.channelModelId === model.id))
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
                        <Button onClick={handleCreateParticipantSocialMedia} className="self-end">
                            追加
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

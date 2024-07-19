// @filename: /components/TableCell.tsx
'use client';

import { useEffect, useState, useRef, FocusEvent as ReactFocusEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import Image from 'next/image';
import { ExternalLink, PlusIcon, Rss, Trash2, X } from "lucide-react";
import { FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { getChannelModels } from '@/data/channelModels';
import { createParticipantChannel, updateParticipantChannel, deleteParticipantChannel } from '@/actions/participantChannels/participantChannels';
import updateParticipant from '@/actions/participants/updateParticipant';

type TableCellProps = {
    header: string;
    participant: Participant;
    participantChannels?: ParticipantChannel[];
    setMinHeight: React.Dispatch<React.SetStateAction<number>>;
    minHeight: number;
}

type Channel = {
    type: string;
    link: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
    x: <FaXTwitter />,
    instagram: <FaInstagram />,
    tiktok: <FaTiktok />,
    note: <Image
        src={"/note.svg"}
        alt='note'
        width={13}
        height={13}
        className='ml-[2px] mr-[1px]'
    />,
    blog: <Rss className='w-4' />,
};

const getWidth = (text: string, font: string): number => {
    if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = font;
            const metrics = context.measureText(text);
            return metrics.width;
        }
    }
    return 50; // デフォルトの最小幅
};

const calculateMaxWidth = (channels: ParticipantChannel[]): number => {
    const maxChannelWidth = Math.max(...channels.map(channel => getWidth(channel.url!, '16px Arial')));
    return maxChannelWidth + 20; // 余白を追加
};

export default function TableCell({ header, participant, participantChannels, setMinHeight, minHeight }: TableCellProps) {
    const [channelModels, setChannelModels] = useState<ChannelModel[]>([]);
    const [value, setValue] = useState<string>('');
    const [channels, setChannels] = useState<ParticipantChannel[]>(participantChannels || []);
    const [currentChannel, setCurrentChannel] = useState<Channel>({ type: '', link: '' });
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
    const [inputWidth, setInputWidth] = useState<number>(50); // デフォルトの最小幅
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchChannelModels = async () => {
            try {
                const models = await getChannelModels();
                setChannelModels(models);
            } catch (error) {
                console.error('Failed to fetch channel models', error);
            }
        };

        fetchChannelModels();
    }, []);

    useEffect(() => {
        let initialValue: string;
        switch (header) {
            case "participantName":
                initialValue = participant?.name || '';
                break;
            case "ruby":
                initialValue = participant?.ruby || '';
                break;
            case "channels":
                initialValue = participantChannels?.map((channel) => channel.url).join(", ") || '';
                break;
            default:
                initialValue = '';
                break;
        }
        setValue(initialValue);
    }, [header, participant, participantChannels]);

    useEffect(() => {
        if (header === "channels") {
            // チャンネルの最も長いURLの幅を計算
            const maxChannelWidth = calculateMaxWidth(channels);
            setInputWidth(maxChannelWidth + 20);
        } else {
            setInputWidth(getWidth(value, '16px Arial') + 20);
        }
    }, [value, channels, header]);

    const handleBlur = async (event: ReactFocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const formData = new FormData();
        if (header === 'participantName' && participant?.id) {
            formData.append('id', participant.id);
            formData.append('name', value);
            await updateParticipant(formData);
        } else if (header && participant?.id) {
            formData.append('id', participant.id);
            formData.append(header, value);
            await updateParticipant(formData);
        }
    };

    const handleKeyDown = async (event: ReactKeyboardEvent<HTMLInputElement>) => {
        if ((event.metaKey && event.key === 'Enter') || (event.ctrlKey && event.key === 'Enter')) {
            const target = event.target as HTMLInputElement;
            target.blur(); // Blur the input to trigger the handleBlur event
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleChannelTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentChannel({ ...currentChannel, type: event.target.value });
    };

    const handleChannelLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentChannel({ ...currentChannel, link: event.target.value });
    };

    const addChannel = async () => {
        const newChannel = {
            id: '',
            createdAt: '',
            participantId: participant?.id || '',
            channelModelId: currentChannel.type,
            url: currentChannel.link,
        };

        // バリデーションを追加
        if (!newChannel.participantId || !newChannel.channelModelId) {
            console.error('Invalid participantId or channelModelId');
            return;
        }

        const channelFormData = new FormData();
        channelFormData.append('participantId', newChannel.participantId);
        channelFormData.append('channelModelId', newChannel.channelModelId);
        channelFormData.append('url', newChannel.url);
        const response = await createParticipantChannel(channelFormData);

        if (response.success) {
            newChannel.id = response.data?.id!; // 返された新しいIDを設定
            setChannels([...channels, newChannel]);
            console.log('Channel created successfully');
        } else {
            console.error('Failed to create channel:', response.error);
        }

        setCurrentChannel({ type: '', link: '' });
        setPopoverOpen(false); // ポップオーバーを閉じる
    };

    const updateChannel = async (channelId: string, newUrl: string) => {
        const formData = new FormData();
        formData.append('id', channelId);
        formData.append('url', newUrl);
        const response = await updateParticipantChannel(formData);

        if (response.success) {
            console.log('Channel updated successfully');
        } else {
            console.error('Failed to update channel:', response.error);
        }
    };

    const deleteChannel = async (channelId: string) => {
        const response = await deleteParticipantChannel(channelId);

        if (response.success) {
            setChannels(channels.filter(channel => channel.id !== channelId));
            console.log('Channel deleted successfully');
        } else {
            console.error('Failed to delete channel:', response.error);
        }
    };

    let content;
    switch (header) {
        case "participantName":
            content = (
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text"
                    style={{ width: `${inputWidth}px` }}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            );
            break;
        case "channels":
            content = (
                <div className="flex flex-col gap-6">
                    {channels.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {channels.map((channel, index) => {
                                const channelModel = channelModels.find((channelModel) => channelModel.id === channel.channelModelId);
                                return (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="flex items-center justify-center">
                                            {iconMap[channelModel?.name?.toLowerCase() || '']}
                                            <span className='ml-2'>:</span>
                                            <input
                                                type="text"
                                                value={channel.url!}
                                                onChange={(e) => {
                                                    const newUrl = e.target.value;
                                                    setChannels(channels.map((ch, idx) => idx === index ? { ...ch, url: newUrl } : ch));
                                                    const maxWidth = calculateMaxWidth(channels);
                                                    setInputWidth(maxWidth);
                                                }}
                                                className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text"
                                                onBlur={(e) => updateChannel(channel.id, e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                style={{ width: `${inputWidth}px` }}
                                            />
                                            {
                                                channel.url && (
                                                    <Button
                                                        variant="ghost"
                                                        className='p-2'
                                                        type='button'
                                                    >
                                                        <a
                                                            href={`${channel.url}`}
                                                            target='_blank'
                                                            rel='noreferrer noopener'
                                                            className='text-[#0000ee] hover:underline ml-1'
                                                        >
                                                            <ExternalLink className='w-4' />
                                                        </a>
                                                    </Button>
                                                )
                                            }
                                            <Button
                                                variant="ghost"
                                                className="p-2 w-[36px]"
                                                type='button'
                                                onClick={() => deleteChannel(channel.id)}
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
                        {
                            channels.length < 5 &&
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="p-2 flex justify-center items-center gap-3 hover:border-gray-600"
                                >
                                    <PlusIcon />
                                    SNSを追加する
                                </Button>
                            </PopoverTrigger>
                        }
                        <PopoverContent className="w-fit p-4">
                            <div className="flex flex-col gap-3">
                                <select
                                    value={currentChannel.type}
                                    onChange={handleChannelTypeChange}
                                    className='cursor-pointer rounded px-2 py-1 hover:bg-gray-200 border'
                                >
                                    <option value="">選択してください</option>
                                    {
                                        channelModels
                                            .filter((model) => !channels.some(channel => channel.channelModelId === model.id))
                                            .map((model) => (
                                                <option key={model.id} value={model.id}>{model.name}</option>
                                            ))
                                    }
                                </select>
                                <input
                                    type="text"
                                    value={currentChannel.link}
                                    onChange={handleChannelLinkChange}
                                    placeholder="リンクを入力"
                                    className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 border"
                                />
                                <Button onClick={addChannel} className="self-end">
                                    追加
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            );
            break;
        default:
            content = (
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text"
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    style={{ width: `${inputWidth}px` }}
                />
            );
    }

    useEffect(() => {
        if (ref.current) {
            const currentHeight = ref.current.offsetHeight;
            setMinHeight((prevMinHeight: number) => Math.max(prevMinHeight, currentHeight));
        }
    }, [content, setMinHeight, channels.length]);

    return (
        <div ref={ref} className={`min-w-max p-4 bg-white border-b flex items-center ${header === "channels" && "justify-center"}`} style={{ minHeight: `${minHeight}px` }}>
            {content}
        </div>
    );
}

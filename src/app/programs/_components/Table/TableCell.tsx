// @filename: /components/TableCell.tsx
'use client';

import { useEffect, useState, useRef, FocusEvent as ReactFocusEvent, KeyboardEvent as ReactKeyboardEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { Circle, ExternalLink, PlusIcon, Rss, Trash2, X } from "lucide-react";
import { FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import IconQuestion from '../icons/IconQuestion';
import { getChannelModels } from '@/data/channelModels';
import { createParticipantChannel, updateParticipantChannel, deleteParticipantChannel } from '@/actions/participantChannels/participantChannels';
import updateProgram from "@/actions/programs/updateProgram";
import updateParticipant from '@/actions/participants/updateParticipant';
import createProgramImages from "@/actions/storages/programImages/createProgramImage";
import deleteProgramImage from '@/actions/storages/programImages/deleteProgramImage';

type TableCellProps = {
    header?: string;
    program: Program;
    participant: Participant;
    participantChannel: ParticipantChannel[];
    setMinHeight: React.Dispatch<React.SetStateAction<number>>;
    minHeight: number;
}

type Channel = {
    type: string;
    link: string;
}

const genres = [
    "音楽",
    "ダンス",
    "パフォーマンス"
]

const venues = [
    "メインステージ",
    "パフォーマンスエリア",
    "エントランスエリア"
]

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
    const maxChannelWidth = Math.max(...channels.map(channel => getWidth(channel.url, '16px Arial')));
    return maxChannelWidth + 20; // 余白を追加
};

export default function TableCell({ header, program, participant, participantChannel, setMinHeight, minHeight }: TableCellProps) {
    const [channelModels, setChannelModels] = useState<ChannelModel[]>([]);
    const [value, setValue] = useState<string>('');
    const [channels, setChannels] = useState<ParticipantChannel[]>(participantChannel || []);
    const [currentChannel, setCurrentChannel] = useState<Channel>({ type: '', link: '' });
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
    const [inputWidth, setInputWidth] = useState<number>(50); // デフォルトの最小幅
    const ref = useRef<HTMLDivElement>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(program.image || null);
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        let initialValue: string | string[];
        switch (header) {
            case "participantName":
                initialValue = participant?.name || '';
                break;
            case "programName":
                initialValue = program.name || '';
                break;
            case "startTime":
                initialValue = `${program.startHour || ''}:${program.startMinutes || ''}`;
                break;
            case "endTime":
                initialValue = `${program.endHour || ''}:${program.endMinutes || ''}`
                break;
            case "releaseDate":
                initialValue = `${program.releaseMonth || ''}/${program.releaseDay || ''}`
                break;
            case "eventDate":
                initialValue = program.eventDate || '3日';
                break;
            case "isPhotographable":
                initialValue = program.isPhotographable || '不明';
                break;
            case "channels":
                initialValue = participantChannel?.map((channel) => channel.url) || '';
                break;
            default:
                initialValue = (program[header as keyof Program] as string) || '';
        }
        setValue(Array.isArray(initialValue) ? initialValue.join(", ") : initialValue);
    }, [header, program, participant, participantChannel]);

    useEffect(() => {
        if (header === "channels") {
            // チャンネルの最も長いURLの幅を計算
            const maxChannelWidth = calculateMaxWidth(channels);
            setInputWidth(maxChannelWidth + 20);
        } else {
            setInputWidth(getWidth(value, '16px Arial') + 20);
        }
    }, [value, channels, header]);

    useEffect(() => {
        if (ref.current) {
            const currentHeight = ref.current.offsetHeight;
            setMinHeight((prevminHeight: number) => Math.max(prevminHeight, currentHeight));
        }
    }, [channels.length, setMinHeight]);

    const handleBlur = async (event: ReactFocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const formData = new FormData();
        if (header === 'participantName' && participant?.id) {
            formData.append('id', participant.id);
            formData.append('name', value);
            await updateParticipant(formData);
        } else {
            formData.append('id', program.id);
            if (header === "startTime" || header === "endTime") {
                const [hour, minutes] = value.split(':');
                formData.append(header === "startTime" ? "startHour" : "endHour", hour);
                formData.append(header === "startTime" ? "startMinutes" : "endMinutes", minutes);
            } else if (header === "releaseDate") {
                const [month, day] = value.split('/');
                formData.append('releaseMonth', month);
                formData.append('releaseDay', day);
            } else if (header === "programName") {
                formData.append('name', value);
            } else if (header === "eventDate") {
                formData.append('eventDate', value);
            } else if (header === "isPhotographable") {
                formData.append('isPhotographable', value);
            } else {
                formData.append(header || 'unknown', value);
            }
            await updateProgram(formData);
        }
    };

    const handleKeyDown = async (event: ReactKeyboardEvent<HTMLInputElement>) => {
        if ((event.metaKey && event.key === 'Enter') || (event.ctrlKey && event.key === 'Enter')) {
            const target = event.target as HTMLInputElement;
            target.blur(); // Blur the input to trigger the handleBlur event
        }
    };

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValue(event.target.value);
        setInputWidth(getWidth(event.target.value, '16px Arial') + 20);

        if (header === "eventDate") {
            const formData = new FormData();
            formData.append('id', program.id);
            formData.append('eventDate', event.target.value);
            await updateProgram(formData);
        }

        if (header === "genre") {
            const formData = new FormData();
            formData.append('id', program.id);
            formData.append('genre', event.target.value);
            await updateProgram(formData);
        }

        if (header === "venue") {
            const formData = new FormData();
            formData.append('id', program.id);
            formData.append('venue', event.target.value);
            await updateProgram(formData);
        }
    };

    const handleIconChange = async (newValue: string) => {
        setValue(newValue);
        setInputWidth(getWidth(newValue, '16px Arial') + 20);

        const formData = new FormData();
        formData.append('id', program.id);
        formData.append('isPhotographable', newValue);
        await updateProgram(formData);

        // Close the popover
        setPopoverOpen(false);
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
        setLoading(true); // 削除開始時にローディング状態に設定
        const response = await deleteParticipantChannel(channelId);

        if (response.success) {
            setChannels(channels.filter(channel => channel.id !== channelId));
            console.log('Channel deleted successfully');
        } else {
            console.error('Failed to delete channel:', response.error);
        }
        setLoading(false); // 削除終了時にローディング状態を解除
    };

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
            const programId = program.id; // 適切なプログラムIDを使用してください
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

    const handleImageButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // リセットするためにvalueを空にする
            fileInputRef.current.click();
        }
    };

    const handleImageDelete = async () => {
        const fileName = imageUrl?.split('/').pop();
        if (!fileName) return;

        const response = await deleteProgramImage(program.id, fileName);

        if (response.success) {
            setImageUrl(null);
        } else {
            console.error('Error deleting image:', response.error);
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
        case "isPhotographable":
            content = (
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={`cursor-pointer rounded mx-auto hover:border-gray-600 transition ${value === "不明" ? "p-[5px]" : "p-2"}`}
                        >
                            {value === "可" && <Circle />}
                            {value === "不可" && <X />}
                            {value === "不明" && <IconQuestion />}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <div className="flex justify-around items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => handleIconChange("可")}
                                className='flex justify-center items-center gap-3 py-1 px-2'
                            >
                                <Circle />
                                撮影可
                            </Button>
                            |
                            <Button
                                variant="ghost"
                                onClick={() => handleIconChange("不可")}
                                className='flex justify=center items-center gap-3 py-1 px-2'
                            >
                                <X />
                                撮影不可
                            </Button>
                            |
                            <Button
                                variant="ghost"
                                onClick={() => handleIconChange("不明")}
                                className='flex justify中心 items-center gap-3 pl-1'
                            >
                                <IconQuestion />
                                不明
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            );
            break;
        case "image":
            content = (
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
                </>
            );
            break;
        case "startTime":
        case "endTime":
            const [hour, minutes] = value.split(':');
            content = (
                <div className='flex justify-center items-center'>
                    <input
                        type="text"
                        value={hour}
                        onChange={(e) => {
                            const newValue = `${e.target.value}:${minutes}`;
                            setValue(newValue);
                        }}
                        className="cursor-pointer rounded pr-1 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text max-w-[26px] text-right"
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        maxLength={2}
                    />
                    :
                    <input
                        type="text"
                        value={minutes}
                        onChange={(e) => {
                            const newValue = `${hour}:${e.target.value}`;
                            setValue(newValue);
                        }}
                        className="cursor-pointer rounded pl-1 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text max-w-[28px] text-left"
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        maxLength={2}
                    />
                </div>
            );
            break;
        case "releaseDate":
            const [month, day] = value.split('/');
            content = (
                <div className='flex justify-center items-center'>
                    <input
                        type="text"
                        value={month}
                        onChange={(e) => {
                            const newMonth = e.target.value;
                            const newValue = `${newMonth}/${day}`;
                            setValue(newValue);
                            setInputWidth(getWidth(newValue, '16px Arial') + 20);
                        }}
                        className="cursor-pointer rounded pr-1 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text max-w-[26px] text-right"
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        maxLength={2}
                    />
                    /
                    <input
                        type="text"
                        value={day}
                        onChange={(e) => {
                            const newDay = e.target.value;
                            const newValue = `${month}/${newDay}`;
                            setValue(newValue);
                            setInputWidth(getWidth(newValue, '16px Arial') + 20);
                        }}
                        className="cursor-pointer rounded pl-1 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text max-w-[28px] text-left"
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        maxLength={2}
                    />
                </div>
            );
            break;
        case "eventDate":
            content = (
                <select
                    name="eventDate"
                    value={value}
                    onChange={handleChange}
                    className='cursor-pointer rounded px-2 py-1 hover:bg-gray-200 border'
                >
                    <option value="3日">3日</option>
                    <option value="4日">4日</option>
                    <option value="5日">5日</option>
                </select>
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
                                                value={channel.url}
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
        case "genre":
            if (!value) {
                content = (
                    <select
                        value={value}
                        name="genreSelect"
                        id="genreSelect"
                        onChange={handleChange}
                        className='cursor-pointer rounded px-2 py-1 hover:bg-gray-200 border'
                    >
                        {
                            genres.map((genre) => (
                                <option key={genre} value={`${genre}`}>{genre}</option>
                            ))
                        }
                    </select>
                )
            } else {
                content = (
                    <select
                        value={value}
                        name="genreSelect"
                        id="genreSelect"
                        onChange={handleChange}
                        className='cursor-pointer rounded px-2 py-1 hover:bg-gray-200 border'
                    >
                        <option value={value}>{value}</option>
                        {
                            genres
                                .filter((genre) => genre !== value)
                                .map((genre) => (
                                    <option key={genre} value={`${genre}`}>{genre}</option>
                                ))
                        }
                    </select>
                )
            }
            break;
        case "venue":
            if (!value) {
                content = (
                    <select
                        value={value}
                        name="venueSelect"
                        id="venueSelect"
                        onChange={handleChange}
                        className='cursor-pointer rounded px-2 py-1 hover:bg-gray-200 border'
                    >
                        {
                            venues.map((venue) => (
                                <option key={venue} value={`${venue}`}>{venue}</option>
                            ))
                        }
                    </select>
                )
            } else {
                content = (
                    <select
                        value={value}
                        name="venueSelect"
                        id="venueSelect"
                        onChange={handleChange}
                        className='cursor-pointer rounded px-2 py-1 hover:bg-gray-200 border'
                    >
                        <option value={value}>{value}</option>
                        {
                            venues
                                .filter((venue) => venue !== value)
                                .map((venue) => (
                                    <option key={venue} value={`${venue}`}>{venue}</option>
                                ))
                        }
                    </select>
                )
            }
            break;
        default:
            if (!value) {
                content = (
                    <input
                        type="text"
                        onChange={handleChange}
                        className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text"
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder='入力してください。'
                    />
                );
            } else {
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
    }

    useEffect(() => {
        if (ref.current) {
            const currentHeight = ref.current.offsetHeight;
            setMinHeight((prevminHeight: number) => Math.max(prevminHeight, currentHeight));
        }
    }, [content, setMinHeight, channels.length]);

    return (
        <div ref={ref} className={`min-w-max p-4 bg-white border-b flex items-center ${header === "channels" && "justify-center"}`} style={{ minHeight: `${minHeight}px` }}>
            {content}
        </div>
    );
}

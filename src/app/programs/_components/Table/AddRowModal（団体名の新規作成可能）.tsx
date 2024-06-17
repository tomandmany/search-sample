// @filename: /components/AddRowModal.tsx
'use client'

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import createProgram from "@/actions/programs/createProgram";
import createParticipant from "@/actions/participants/createParticipant";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from 'next/navigation';

type AddRowModalProps = {
    onClose: () => void;
    existingParticipants: Participant[];
};

type FormDataType = {
    name: string;
    releaseMonth: string;
    releaseDay: string;
    eventDate: string;
    startHour: string;
    startMinutes: string;
    endHour: string;
    endMinutes: string;
    venue: string;
    message: string;
    participantId: string;
    participantName: string;
    genre: string;
    details: string;
    ruby: string;
};

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

const eventDates = [
    "3日",
    "4日",
    "5日"
]

export default function AddRowModal({ onClose, existingParticipants }: AddRowModalProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<FormDataType>({
        name: '',
        releaseMonth: '1',
        releaseDay: '1',
        eventDate: '3日',
        startHour: '00',
        startMinutes: '00',
        endHour: '00',
        endMinutes: '00',
        venue: '',
        message: '',
        participantId: '',
        participantName: '',
        genre: '',
        details: '',
        ruby: '',
    });

    const [participantOptions, setParticipantOptions] = useState<string[]>(existingParticipants.map(p => p.name ?? ''));

    useEffect(() => {
        setParticipantOptions(existingParticipants.map(p => p.name ?? ''));
    }, [existingParticipants]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, participantName: value, participantId: '' }));
        const filteredParticipants = existingParticipants
            .filter(participant => participant.name?.toLowerCase().includes(value.toLowerCase()))
            .map(p => p.name ?? '');
        setParticipantOptions(filteredParticipants);
    };

    const handleParticipantSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedParticipant = existingParticipants.find(p => p.name === e.target.value);
        if (selectedParticipant) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                participantId: selectedParticipant.id,
                participantName: selectedParticipant.name ?? ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let participantId = formData.participantId;
        if (!participantId && formData.participantName) {
            const participantFormData = new FormData();
            participantFormData.append('name', formData.participantName);
            const participantResponse = await createParticipant(participantFormData);
            if (participantResponse.success && participantResponse.data && participantResponse.data.id) {
                participantId = participantResponse.data.id;
            } else {
                console.error('Failed to create participant:', participantResponse.error);
                return;
            }
        }

        if (!participantId) {
            console.error('Participant ID is undefined');
            return;
        }

        const programFormData = new FormData();
        programFormData.append('name', formData.name);
        programFormData.append('releaseMonth', formData.releaseMonth);
        programFormData.append('releaseDay', formData.releaseDay);
        programFormData.append('startHour', formData.startHour);
        programFormData.append('startMinutes', formData.startMinutes);
        programFormData.append('endHour', formData.endHour);
        programFormData.append('endMinutes', formData.endMinutes);
        programFormData.append('venue', formData.venue);
        programFormData.append('message', formData.message);
        programFormData.append('participantId', participantId);
        programFormData.append('genre', formData.genre);
        programFormData.append('details', formData.details);
        programFormData.append('ruby', formData.ruby);

        const response = await createProgram(programFormData);
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
            releaseMonth: '1',
            releaseDay: '1',
            eventDate: '3日',
            startHour: '00',
            startMinutes: '00',
            endHour: '00',
            endMinutes: '00',
            venue: '',
            message: '',
            participantId: '',
            participantName: '',
            genre: '',
            details: '',
            ruby: '',
        });
    };

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className='w-full h-full fixed' onClick={onClose} />
            <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto absolute">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">新しい企画を追加</h2>
                    <Button variant="ghost" onClick={onClose} className='p-2'>
                        <X />
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">企画名</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label className="block mb-1">公開月</label>
                            <input
                                type="number"
                                name="releaseMonth"
                                value={formData.releaseMonth}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="1"
                                max="12"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1">公開日</label>
                            <input
                                type="number"
                                name="releaseDay"
                                value={formData.releaseDay}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="1"
                                max="31"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1">実施日</label>
                        <select
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">選択してください</option>
                            {eventDates.map((eventDate) => (
                                <option key={eventDate} value={eventDate}>{eventDate}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label className="block mb-1">開始時間（時）</label>
                            <input
                                type="number"
                                name="startHour"
                                value={formData.startHour}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="0"
                                max="23"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1">開始時間（分）</label>
                            <input
                                type="number"
                                name="startMinutes"
                                value={formData.startMinutes}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="0"
                                max="59"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label className="block mb-1">終了時間（時）</label>
                            <input
                                type="number"
                                name="endHour"
                                value={formData.endHour}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="0"
                                max="23"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1">終了時間（分）</label>
                            <input
                                type="number"
                                name="endMinutes"
                                value={formData.endMinutes}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="0"
                                max="59"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1">ジャンル</label>
                        <select
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">選択してください</option>
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">場所</label>
                        <select
                            name="venue"
                            value={formData.venue}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">選択してください</option>
                            {venues.map((venue) => (
                                <option key={venue} value={venue}>{venue}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">詳細</label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows={3}
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
                    <div>
                        <label className="block mb-1">メッセージ</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows={3}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">団体名</label>
                        <input
                            type="text"
                            name="participantName"
                            value={formData.participantName}
                            onChange={handleParticipantChange}
                            onBlur={handleParticipantSelect}
                            className="w-full p-2 border rounded"
                            list="participant-options"
                            required
                        />
                        <datalist id="participant-options">
                            {participantOptions.map((name) => (
                                <option
                                    key={name}
                                    value={name}
                                />
                            ))}
                        </datalist>
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

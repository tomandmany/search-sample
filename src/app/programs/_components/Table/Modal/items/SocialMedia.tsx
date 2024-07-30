// src/components/items/SocialMedia.tsx

import { useState, useEffect } from 'react';
import getSocialMediaModels from '@/data/socialMediaModels';

type SocialMediaProps = {
    onInputChange: (key: string, value: { type: string, url: string }) => void;
};

export default function SocialMedia({ onInputChange }: SocialMediaProps) {
    const [socialMediaUrl, setSocialMediaUrl] = useState<string>('');
    const [socialMediaType, setSocialMediaType] = useState<string>('');
    const [socialMediaModels, setSocialMediaModels] = useState<SocialMediaModel[]>([]);

    useEffect(() => {
        async function fetchSocialMediaModels() {
            const models = await getSocialMediaModels();
            setSocialMediaModels(models);
        }
        fetchSocialMediaModels();
    }, []);

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const type = event.target.value;
        setSocialMediaType(type);
        onInputChange('socialMedia', { type, url: socialMediaUrl });
    };

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value;
        setSocialMediaUrl(url);
        onInputChange('socialMedia', { type: socialMediaType, url });
    };

    return (
        <div className='w-full'>
            <label className="block mb-1">SNSアカウント</label>
            <select
                value={socialMediaType}
                onChange={handleTypeChange}
                className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 border w-full mb-2"
                required
            >
                <option value="">種類を選択してください</option>
                {socialMediaModels.map((model) => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                ))}
            </select>
            <input
                type="text"
                value={socialMediaUrl}
                onChange={handleUrlChange}
                placeholder="SNSアカウントのURLを入力"
                className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200 border w-full"
                required
            />
        </div>
    );
}

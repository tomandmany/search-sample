// app/components/InputField.tsx
'use client';

import { KeyboardEvent, FocusEvent } from 'react';
import updateOutstageProgram from '@/actions/sampleOutstagePrograms/updateSampleOutstageProgram';

type InputFieldProps = {
    id: string;
    field: keyof OutstageProgram;
    value: string;
    onValueChange: (field: keyof OutstageProgram, value: string) => void;
};

const InputField = ({ id, field, value, onValueChange }: InputFieldProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(field, event.target.value);
    };

    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if ((event.metaKey && event.key === 'Enter') || (event.ctrlKey && event.key === 'Enter')) {
            const target = event.target as HTMLInputElement;
            target.blur();
        }
    };

    const handleBlur = async (event: FocusEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        const formData = new FormData();
        formData.append('id', id);
        formData.append(field, newValue);

        const response = await updateOutstageProgram(formData);
        if (!response.success) {
            console.error('Failed to update outstageProgram:', response.error);
        } else {
            console.log('outstageProgram updated successfully:', response.data);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700">{field}</label>
            <input
                type="text"
                name={field}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="border p-2 w-full"
            />
        </div>
    );
};

export default InputField;

// src/components/items/CustomSelect.tsx
'use client';

import React from 'react';

type CustomSelectProps = {
    value: string;
    column: { label: string, key: string };
    options: string[];
    onChange: (value: string) => void;
};

const CustomSelect: React.FC<CustomSelectProps> = ({ column, value, options, onChange }) => {
    return (
        <div className='w-full'>
            <label className="block mb-1">{column.label}</label>
            <select
                value={value}
                name="customSelect"
                id="customSelect"
                className='cursor-pointer rounded px-2 py-2 hover:bg-gray-100 hover:border-gray-600 border w-full'
                onChange={(e) => onChange(e.target.value)}
            >
                {!value && <option value="">選択してください</option>}
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default CustomSelect;
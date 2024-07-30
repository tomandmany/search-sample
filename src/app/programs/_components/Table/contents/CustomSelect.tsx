// src/components/contents/CustomSelect.tsx
'use client';

type CustomSelectProps = {
    value: string;
    options: string[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLSelectElement>) => void;
    maxWidth: number;
};

const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange, onBlur, maxWidth }) => {
    return (
        <select
            value={value}
            name="customSelect"
            id="customSelect"
            className='cursor-pointer rounded px-2 py-1 hover:bg-gray-100 hover:border-gray-600 border w-full'
            onChange={onChange}
            onBlur={onBlur}
            style={{ minWidth: `${maxWidth}px` }}
        >
            {!value && <option value="">選択してください</option>}
            {options.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    );
};

export default CustomSelect;

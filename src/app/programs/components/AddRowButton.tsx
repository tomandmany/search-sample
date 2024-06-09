'use client'

import createProgram from "@/actions/programs/createProgram";
import { PlusIcon } from "lucide-react";
import { MouseEvent } from 'react';

export default function AddRowButton() {
    const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', 'New Program');
        formData.append('releaseMonth', '1');
        formData.append('releaseDay', '1');
        formData.append('startHour', '00');
        formData.append('startMinutes', '00');
        formData.append('endHour', '00');
        formData.append('endMinutes', '00');
        formData.append('venue', '');
        formData.append('message', '');

        await createProgram(formData);
    };

    return (
        <button
            className="flex justify-center items-center border rounded p-2 mx-auto mt-6 bg-white hover:border-gray-600 transition"
            onClick={handleClick}
        >
            <PlusIcon />
        </button>
    );
}

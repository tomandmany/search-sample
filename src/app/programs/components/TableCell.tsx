'use client'

import { FocusEvent } from 'react';
import updateProgram from "@/actions/programs/updateProgram";
import { Circle, PlusIcon, X } from "lucide-react";

type TableCellProps = {
    children: React.ReactNode;
    headerName?: string;
    programId: string;
}

export default function TableCell({ children, headerName, programId }: TableCellProps) {
    const handleBlur = async (event: FocusEvent<HTMLInputElement>) => {
        const formData = new FormData();
        formData.append('id', programId);
        formData.append(headerName || 'unknown', event.target.value);
        await updateProgram(formData);
    };

    let content;
    switch (headerName) {
        case "isPhotographable":
            content = (
                <button type="button" className="cursor-pointer rounded border p-2 mx-auto hover:border-gray-600 transition">
                    {children === "可" ? <Circle /> : <X />}
                </button>
            );
            break;
        case "image":
            if (children === 'なし') {
                content = (
                    <button type="button" className="cursor-pointer rounded border p-2 mx-auto hover:border-gray-600 transition">
                        <PlusIcon />
                    </button>
                );
            } else {
                content = children;
            }
            break;
        case "startTime":
        case "endTime":
            content = (
                <div>
                    {children}
                </div>
            );
            break;
        default:
            content = (
                <input
                    type="text"
                    defaultValue={typeof children === 'string' ? children : ''}
                    className="placeholder:text-black"
                    onBlur={handleBlur}
                />
            );
    }

    return (
        <div className="min-w-max min-h-[100px] p-4 bg-white border-b flex items-center">
            {content}
        </div>
    );
}

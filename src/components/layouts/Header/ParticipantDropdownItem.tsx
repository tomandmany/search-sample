import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ParticipantDropdownItemProps = {
    link: string;
    name: string;
    handleClick: () => void;
};

export default function ParticipantDropdownItem({ link, name, handleClick }: ParticipantDropdownItemProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href={`/participants/${link}`}
            className="hover:bg-slate-200 p-2 rounded transition flex justify-between"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span>{name}</span>
            {isHovered && <MoveRight />}
        </Link>
    )
}
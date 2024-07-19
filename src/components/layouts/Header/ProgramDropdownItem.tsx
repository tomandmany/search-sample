import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ProgramDropdownItemProps = {
    link: string;
    name: string;
    handleClick: () => void;
};

export default function ProgramDropdownItem({ link, name, handleClick }: ProgramDropdownItemProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href={`/programs/${link}`}
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
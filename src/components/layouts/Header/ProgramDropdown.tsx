// app/components/ProgramDropdown.tsx

'use client'

import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import ProgramDropdownItem from "./ProgramDropdownItem";

export default function ProgramDropdown() {
    const [isHovered, setIsHovered] = useState(false);
    const [isSubmenuHovered, setIsSubmenuHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleSubmenuMouseEnter = () => {
        setIsSubmenuHovered(true);
    };

    const handleSubmenuMouseLeave = () => {
        setIsSubmenuHovered(false);
    };

    const handleLinkClick = () => {
        setIsHovered(false);
        setIsSubmenuHovered(false);
    };

    const isMenuActive = isHovered || isSubmenuHovered;

    return (
        <div
            className="hover:bg-slate-200 p-2 rounded transition flex cursor-pointer relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span>企画管理</span>
            <ChevronLeft
                className={`transition-transform ${isMenuActive ? "-rotate-90" : "rotate-0"}`}
            />
            <div
                className={`absolute flex-col gap-4 top-10 left-0 border rounded-md p-4 min-w-[250px] bg-white transition-opacity shadow-md ${isMenuActive ? "flex" : "hidden"}`}
                onMouseEnter={handleSubmenuMouseEnter}
                onMouseLeave={handleSubmenuMouseLeave}
            >
                <ProgramDropdownItem link="" name="全部門" handleClick={handleLinkClick} />
                <ProgramDropdownItem link="entrance" name="エントランスエリア" handleClick={handleLinkClick} />
                <ProgramDropdownItem link="main" name="メインステージ" handleClick={handleLinkClick} />
                <ProgramDropdownItem link="performance" name="パフォーマンスエリア" handleClick={handleLinkClick} />
                <ProgramDropdownItem link="booth" name="模擬店" handleClick={handleLinkClick} />
                <ProgramDropdownItem link="room" name="教室" handleClick={handleLinkClick} />
            </div>
        </div>
    );
}

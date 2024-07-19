// app/components/Header.tsx

import ProgramDropdown from "./ProgramDropdown";
import ParticipantDropdown from "./ParticipantDropdown";
import Link from "next/link";

export default function Header() {
    return (
        <header className="py-8 px-20 border-b-2 sticky top-0 bg-white space-x-10 flex z-10">
            <Link
                href={'/'}
                className="hover:bg-slate-200 p-2 rounded transition flex justify-between"
            >
                検索ページ
            </Link>
            <ProgramDropdown />
            <ParticipantDropdown />
        </header>
    );
}

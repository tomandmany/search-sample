// app/components/Header.tsx

import ProgramDropdown from "./ProgramDropdown";
import ParticipantDropdown from "./ParticipantDropdown";

export default function Header() {
    return (
        <header className="py-8 px-20 border-b-2 sticky top-0 bg-white space-x-10 flex z-10">
            <ProgramDropdown />
            <ParticipantDropdown />
        </header>
    );
}

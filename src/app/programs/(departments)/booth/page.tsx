import { Metadata } from "next";
import { getBoothPrograms } from "@/data/programs/boothPrograms";
import { getParticipants } from "@/data/participants";
import { getParticipantSocialMedias } from "@/data/participantSocialMedias";
import TableRoot from "@/app/programs/_components/Table/TableRoot";
import ProgramProvider from "@/app/programs/contexts/ProgramProvider";
import ProgramContext from "@/app/programs/contexts/ProgramContext";
import { boothProgramColumns } from "@/data/columns";


export const metadata: Metadata = {
    title: "模擬店",
    description: "模擬店のプログラム一覧です。",
};

export default async function Page() {
    const programs = await getBoothPrograms();
    const participants = await getParticipants();
    const participantSocialMedias = await getParticipantSocialMedias();

    return (
        <main className="items-center justify-between p-24">
            <h1 className="text-xl mb-8 bg-gray-200 max-w-fit px-4 py-2">模擬店</h1>
            <ProgramProvider programs={programs} participants={participants} participantSocialMedias={participantSocialMedias}>
                <TableRoot programContext={ProgramContext} programColumns={boothProgramColumns} department={'booth'} />
            </ProgramProvider>
        </main>
    );
}

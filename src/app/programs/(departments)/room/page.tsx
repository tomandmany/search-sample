import { Metadata } from "next";
import { getRoomPrograms } from "@/data/programs/roomPrograms";
import { getParticipants } from "@/data/participants";
import { getParticipantSocialMedias } from "@/data/participantSocialMedias";
import TableRoot from "@/app/programs/_components/Table/TableRoot";
import ProgramProvider from "@/app/programs/contexts/ProgramProvider";
import ProgramContext from "@/app/programs/contexts/ProgramContext";
import { roomProgramColumns } from "@/data/columns";


export const metadata: Metadata = {
    title: "教室",
    description: "教室のプログラム一覧です。",
};

export default async function Page() {
    const programs = await getRoomPrograms();
    const participants = await getParticipants();
    const participantSocialMedias = await getParticipantSocialMedias();

    return (
        <main className="items-center justify-between p-24">
            <h1 className="text-xl mb-8 bg-gray-200 max-w-fit px-4 py-2">教室</h1>
            <ProgramProvider programs={programs} participants={participants} participantSocialMedias={participantSocialMedias}>
                <TableRoot programContext={ProgramContext} programColumns={roomProgramColumns} department={'room'} />
            </ProgramProvider>
        </main>
    );
}

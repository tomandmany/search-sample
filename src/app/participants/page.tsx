import { Metadata } from "next";
import AddRowButton from "./_components/Table/AddRowButton";
import TableRoot from "./_components/Table/TableRoot";
import { getPrograms } from "@/data/programs";
import { getParticipants } from "@/data/participants";
import { getParticipantChannels } from "@/data/participantChannels";

export const metadata: Metadata = {
    title: "参加団体情報テーブル",
};

export default async function Page() {
    const programs = await getPrograms();
    const participants = await getParticipants();
    const participantChannels = await getParticipantChannels();

    return (
        <main className="min-h-screen items-center justify-between p-24">
            <TableRoot programs={programs} participants={participants} participantChannels={participantChannels} />
            <AddRowButton />
        </main>
    )
}
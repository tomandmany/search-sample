import { Metadata } from "next";
import { getParticipantSocialMedias } from "@/data/participantSocialMedias";
import { getParticipants } from "@/data/participants";
import TableRoot from "@/app/participants/_components/Table/TableRoot";
import AddRowButton from "./_components/Table/AddRowButton";

export const metadata: Metadata = {
    title: "団体管理テーブル",
};

export default async function Page() {
    const participants = await getParticipants();
    const participantSocialMedias = await getParticipantSocialMedias();

    return (
        <main className="px-[17vw] my-24">
            <TableRoot participants={participants} participantSocialMedias={participantSocialMedias} />
            {/* <AddRowButton /> */}
        </main>
    )
}
import { Metadata } from "next";
import { getBoothPrograms } from "@/data/programs/boothPrograms";
import { getParticipants } from "@/data/participants";
import { getParticipantSocialMedias } from "@/data/participantSocialMedias";
import PageInterface from "../PageInterface";

export const metadata: Metadata = {
    title: "模擬店",
    description: "模擬店のプログラム一覧です。",
};

export default async function Page() {
    const programs = await getBoothPrograms();
    const participants = await getParticipants();
    const participantSocialMedias = await getParticipantSocialMedias();

    return (
        <PageInterface programs={programs} participants={participants} participantSocialMedias={participantSocialMedias} heading="模擬店" target="booth" />
    );
}

import { Metadata } from "next";
import { getOutstagePrograms } from "@/data/programs/outstagePrograms";
import { getParticipants } from "@/data/participants";
import { getParticipantSocialMedias } from "@/data/participantSocialMedias";
import PageInterface from "../PageInterface";

export const metadata: Metadata = {
    title: "屋外ステージ",
    description: "屋外ステージのプログラム一覧です。",
};

export default async function Page() {
    const programs = await getOutstagePrograms();
    const participants = await getParticipants();
    const participantSocialMedias = await getParticipantSocialMedias();

    return (
        <PageInterface programs={programs} participants={participants} participantSocialMedias={participantSocialMedias} heading="屋外ステージ" target="outstage" />
    );
}

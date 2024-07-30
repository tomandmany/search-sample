import { Metadata } from "next";
import { getParticipantSocialMedias } from "@/data/participantSocialMedias";
import { getParticipants } from "@/data/participants";
import PageInterface from "../programs/(departments)/PageInterface";

export const metadata: Metadata = {
    title: "団体管理テーブル",
};

export default async function Page() {
    const participants = await getParticipants();
    const participantSocialMedias = await getParticipantSocialMedias();

    return (
        <PageInterface participants={participants} participantSocialMedias={participantSocialMedias} />
    );
}
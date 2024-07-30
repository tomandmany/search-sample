import { Metadata } from "next";
import { getRoomPrograms } from "@/data/programs/roomPrograms";
import { getParticipants } from "@/data/participants";
import { getParticipantSocialMedias } from "@/data/participantSocialMedias";
import PageInterface from "../PageInterface";

export const metadata: Metadata = {
    title: "教室",
    description: "教室のプログラム一覧です。",
};

export default async function Page() {
    const programs = await getRoomPrograms();
    const participants = await getParticipants();
    const participantSocialMedias = await getParticipantSocialMedias();

    return (
        <PageInterface programs={programs} participants={participants} participantSocialMedias={participantSocialMedias} heading="教室" target="room" />
    );
}

import { Metadata } from "next";
import { getRoomPrograms } from "@/data/programs/roomPrograms";
import PageInterface from "../PageInterface";

export const metadata: Metadata = {
    title: "教室",
    description: "教室のプログラム一覧です。",
};

export default async function Page() {
    const programs = await getRoomPrograms();

    return (
        <PageInterface programs={programs} heading="教室" target="room" />
    );
}

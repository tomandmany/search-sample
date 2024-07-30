import { Metadata } from "next";
import { getBoothPrograms } from "@/data/programs/boothPrograms";
import PageInterface from "../PageInterface";

export const metadata: Metadata = {
    title: "模擬店",
    description: "模擬店のプログラム一覧です。",
};

export default async function Page() {
    const programs = await getBoothPrograms();

    return (
        <PageInterface programs={programs} heading="模擬店" target="booth" />
    );
}

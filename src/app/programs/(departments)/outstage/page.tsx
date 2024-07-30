import { Metadata } from "next";
import { getOutstagePrograms } from "@/data/programs/outstagePrograms";
import PageInterface from "../PageInterface";

export const metadata: Metadata = {
    title: "屋外ステージ",
    description: "屋外ステージのプログラム一覧です。",
};

export default async function Page() {
    const programs = await getOutstagePrograms();

    return (
        <PageInterface programs={programs} heading="屋外ステージ" target="outstage" />
    );
}

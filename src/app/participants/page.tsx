// @filename: /app/programs/(departments)/Page.tsx

import { Metadata } from "next";
import PageInterface from "../programs/(departments)/PageInterface";

export const metadata: Metadata = {
    title: "団体管理テーブル",
};

export default async function Page() {
    return (
        <PageInterface />
    );
}

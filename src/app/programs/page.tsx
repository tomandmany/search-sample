import { Metadata } from "next";
import AddRowButton from "./_components/Table/AddRowButton";
import TableRoot from "./_components/Table/TableRoot";

export const metadata: Metadata = {
    title: "参加団体情報テーブル",
};

export default async function Page() {

    return (
        <main className="min-h-screen items-center justify-between p-24">
            <TableRoot />
            <AddRowButton />
        </main>
    )
}
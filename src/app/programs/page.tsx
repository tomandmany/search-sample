import { Metadata } from "next";
import AddRowButton from "./_components/Table/AddRowButton";
import TableRoot from "./_components/Table/TableRoot";

export const metadata: Metadata = {
    title: "企画管理テーブル",
};

export default async function Page() {
    return (
        <main className="items-center justify-between p-24">
            <h1 className="text-xl mb-8 bg-gray-200 max-w-fit px-4 py-2">全部門</h1>
            <TableRoot />
            <AddRowButton />
        </main>
    )
}
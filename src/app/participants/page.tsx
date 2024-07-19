import { Metadata } from "next";
import AddRowButton from "./_components/Table/AddRowButton";
import TableRoot from "./_components/Table/TableRoot";

export const metadata: Metadata = {
    title: "団体管理テーブル",
};

export default async function Page() {

    return (
        <main className="px-[17vw] my-24">
            <TableRoot />
            <AddRowButton />
        </main>
    )
}
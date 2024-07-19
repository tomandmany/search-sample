import AddRowButton from "@/app/programs/_components/Table/AddRowButton";
import TableRoot from "@/app/programs/_components/Table/TableRoot";

export default async function Page() {
    return (
        <main className="min-h-screen items-center justify-between p-24">
            <h1 className="text-xl mb-8 bg-gray-200 max-w-fit px-4 py-2">パフォーマンスエリア</h1>
            <TableRoot />
            <AddRowButton />
        </main>
    );
}

import AddRowButton from "./components/AddRowButton";
import Table from "./components/Table";

export default function Page() {
    return (
        <main className="min-h-screen items-center justify-between p-24">
            <Table />
            <AddRowButton />
        </main>
    )
}
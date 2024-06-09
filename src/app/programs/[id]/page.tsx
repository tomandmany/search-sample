// パス: /app/page.tsx

import { getPrograms } from "@/data/programs";

export default async function Page({ params }: { params: { id: string } }) {
    const programId = params.id;
    const programs = await getPrograms();

    // currentprogramをフィルタリング
    const currentprogram = programs.find(program => program.id === programId);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {currentprogram ? (
                <>
                    <h1 className="text-2xl font-bold">{currentprogram.name}</h1>
                </>
            ) : (
                <p>program not found</p>
            )}
        </main>
    );
}

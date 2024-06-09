// パス: /app/page.tsx

import { getProjects } from "@/data/projects";

export default async function Page({ params }: { params: { id: string } }) {
    const projectId = params.id;
    const projects = await getProjects();

    // currentProjectをフィルタリング
    const currentProject = projects.find(project => project.id === projectId);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {currentProject ? (
                <>
                    <h1 className="text-2xl font-bold">{currentProject.name}</h1>
                </>
            ) : (
                <p>Project not found</p>
            )}
        </main>
    );
}

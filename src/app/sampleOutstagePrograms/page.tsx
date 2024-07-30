// app/page.tsx
// app/page.tsx
import Component from "./component";
import { getOutstagePrograms } from "@/data/programs/outstagePrograms";

export default async function Page() {
  const outstagePrograms: OutstageProgram[] = await getOutstagePrograms();

  return (
    <div>
      {outstagePrograms.map((outstageProgram) => (
        <div key={outstageProgram.id} className="p-4 border-b border-gray-200">
          <Component
            id={outstageProgram.id}
            program={outstageProgram}
          />
        </div>
      ))}
    </div>
  );
}

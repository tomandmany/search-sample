// // パス: /app/page.tsx
// // @filename: /app/page.tsx
// 'use client';

// import { useState, useEffect, FormEvent } from 'react';
// import { createProject, updateProject, deleteProject } from "@/actions/programs/programs";
// import { getPrograms } from '@/data/programs';

// interface Project {
//     id: string;
//     name: string;
//     month: string;
//     day: string;
//     startHour: string;
//     startMinutes: string;
//     endHour: string;
//     endMinutes: string;
//     place: string;
//     message: string;
//     createdAt: string;
//     participantId: string | null;
// }

// export default function Page() {
//     const [programs, setPrograms] = useState<Project[]>([]);

//     useEffect(() => {
//         const fetchprograms = async () => {
//             const data = await getPrograms();
//             setPrograms(data.map((project: any) => ({
//                 id: project.id ?? '',
//                 name: project.name ?? '',
//                 month: project.month ?? '',
//                 day: project.day ?? '',
//                 startHour: project.startHour ?? '',
//                 startMinutes: project.startMinutes ?? '',
//                 endHour: project.endHour ?? '',
//                 endMinutes: project.endMinutes ?? '',
//                 place: project.place ?? '',
//                 message: project.message ?? '',
//                 createdAt: project.createdAt ?? '',
//                 participantId: project.participantId ?? null,
//             })));
//         };

//         fetchprograms();
//     }, []);

//     const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const formData = new FormData(e.currentTarget);
//         const response = await createProject(formData);
//         if (response.success && response.data) {
//             setPrograms([...programs, response.data as Project]);
//         }
//     };

//     const handleUpdate = async (e: FormEvent<HTMLFormElement>, id: string) => {
//         e.preventDefault();
//         const formData = new FormData(e.currentTarget);
//         formData.append('id', id);
//         const response = await updateProject(formData);
//         if (response.success && response.data) {
//             setPrograms(programs.map((proj) => (proj.id === id ? response.data as Project : proj)));
//         }
//     };

//     const handleDelete = async (id: string) => {
//         const response = await deleteProject(id);
//         if (response.success) {
//             setPrograms(programs.filter((proj) => proj.id !== id));
//         }
//     };

//     return (
//         <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-20 flex-wrap">
//             <form onSubmit={handleCreate} method="POST" className="w-full max-w-md mb-8">
//                 <h1 className="text-2xl font-bold mb-4">プロジェクト作成</h1>
//                 <div className="mb-4">
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                         プロジェクト名
//                     </label>
//                     <input
//                         type="text"
//                         name="name"
//                         id="name"
//                         required
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="month" className="block text-sm font-medium text-gray-700">
//                         月
//                     </label>
//                     <input
//                         type="text"
//                         name="month"
//                         id="month"
//                         required
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="day" className="block text-sm font-medium text-gray-700">
//                         日
//                     </label>
//                     <input
//                         type="text"
//                         name="day"
//                         id="day"
//                         required
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="startHour" className="block text-sm font-medium text-gray-700">
//                         開始時刻（時）
//                     </label>
//                     <input
//                         type="text"
//                         name="startHour"
//                         id="startHour"
//                         required
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="startMinutes" className="block text-sm font-medium text-gray-700">
//                         開始時刻（分）
//                     </label>
//                     <input
//                         type="text"
//                         name="startMinutes"
//                         id="startMinutes"
//                         required
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="endHour" className="block text-sm font-medium text-gray-700">
//                         終了時刻（時）
//                     </label>
//                     <input
//                         type="text"
//                         name="endHour"
//                         id="endHour"
//                         required
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="endMinutes" className="block text-sm font-medium text-gray-700">
//                         終了時刻（分）
//                     </label>
//                     <input
//                         type="text"
//                         name="endMinutes"
//                         id="endMinutes"
//                         required
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="place" className="block text-sm font-medium text-gray-700">
//                         場所
//                     </label>
//                     <input
//                         type="text"
//                         name="place"
//                         id="place"
//                         required
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="message" className="block text-sm font-medium text-gray-700">
//                         メッセージ
//                     </label>
//                     <textarea
//                         name="message"
//                         id="message"
//                         rows={4}
//                         required
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
//                 >
//                     作成
//                 </button>
//             </form>

//             <table className="table-auto w-full max-w-4xl">
//                 <thead>
//                     <tr>
//                         <th className="px-4 py-2">プロジェクト名</th>
//                         <th className="px-4 py-2">月</th>
//                         <th className="px-4 py-2">日</th>
//                         <th className="px-4 py-2">開始時刻</th>
//                         <th className="px-4 py-2">終了時刻</th>
//                         <th className="px-4 py-2">場所</th>
//                         <th className="px-4 py-2">メッセージ</th>
//                         <th className="px-4 py-2">操作</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {programs.map((project) => (
//                         <tr key={project.id}>
//                             <td className="border px-4 py-2">
//                                 <form onSubmit={(e) => handleUpdate(e, project.id)}>
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         defaultValue={project.name}
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                     />
//                                     <input
//                                         type="text"
//                                         name="month"
//                                         defaultValue={project.month}
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                     />
//                                     <input
//                                         type="text"
//                                         name="day"
//                                         defaultValue={project.day}
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                     />
//                                     <input
//                                         type="text"
//                                         name="startHour"
//                                         defaultValue={project.startHour}
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                     />
//                                     <input
//                                         type="text"
//                                         name="startMinutes"
//                                         defaultValue={project.startMinutes}
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                     />
//                                     <input
//                                         type="text"
//                                         name="endHour"
//                                         defaultValue={project.endHour}
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                     />
//                                     <input
//                                         type="text"
//                                         name="endMinutes"
//                                         defaultValue={project.endMinutes}
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                     />
//                                     <input
//                                         type="text"
//                                         name="place"
//                                         defaultValue={project.place}
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                     />
//                                     <textarea
//                                         name="message"
//                                         defaultValue={project.message}
//                                         rows={2}
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                     />
//                                     <button
//                                         type="submit"
//                                         className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 mt-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
//                                     >
//                                         更新
//                                     </button>
//                                 </form>
//                             </td>
//                             <td className="border px-4 py-2">
//                                 <button
//                                     onClick={() => handleDelete(project.id)}
//                                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
//                                 >
//                                     削除
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </main>
//     );
// }
// 'use client'

// import { useContext } from "react";
// import omit from "@/lib/omit";
// import { ProgramContextType } from "@/app/programs/contexts/ProgramContext";

// type TableRootProps = {
//   programContext: React.Context<ProgramContextType | undefined>;
// };

// export default function TableRoot({ programContext }: TableRootProps) {
//   const context = useContext(programContext);
//   if (!context) {
//     throw new Error('TableRoot must be used within a Provider');
//   }
//   const { programs } = context;

//   return (
//     <div>
//       {programs.map((program: UnionProgram) => {
//         const filteredProgram = omit(program, ['id', 'createdAt']);
//         if ('mainstageColumn' in program) {
//           return (
//             <div key={program.mainstageColumn}>
//               {Object.entries(filteredProgram).map(([key, value]) => (
//                 <div key={key}>
//                   {value}
//                 </div>
//               ))}
//             </div>
//           );
//         } else {
//           return (
//             <div key={program.createdAt}>
//               {Object.entries(filteredProgram).map(([key, value]) => (
//                 <div key={key}>
//                   {value}
//                 </div>
//               ))}
//             </div>
//           );
//         }
//       })}
//     </div>
//   );
// }

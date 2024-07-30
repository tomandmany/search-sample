// // src/components/TableRoot.tsx
// 'use client';

// import { useState } from 'react';
// import { ProgramContextType } from '@/app/programs/contexts/ProgramContext';
// import TableColumn from './TableColumn';
// import TableHeader from './TableHeader';
// import TableCell from './TableCell';
// import { participantColumns } from '@/data/columns';

// type TableRootProps = {
//   programs: UnionProgram[];
//   participants: Participant[];
//   participantSocialMedias: ParticipantSocialMedia[];
//   programContext: React.Context<ProgramContextType | undefined>;
//   programColumns: { header: string; property: string }[];
//   target: 'booth' | 'outstage' | 'room';
// };

// type UnionProgram = {
//   [key: string]: any; // あなたの実際のUnionProgram型を定義してください
// };

// function hasProperty<T extends object, K extends PropertyKey>(obj: T, key: K): obj is T & Record<K, unknown> {
//   return key in obj;
// }

// export default function TableRoot({ programs, participants, participantSocialMedias, programContext, programColumns, target }: TableRootProps) {
//   const [rowHeights, setRowHeights] = useState<{ [key: string]: number }>({});

//   const handleSetRowHeight = (programId: string, height: number) => {
//     setRowHeights((prev) => ({ ...prev, [programId]: height }));
//   };

//   return (
//     <div className="flex max-w-fit mx-auto overflow-x-auto border-x border-t shadow-md hidden-scrollbar">
//       {participantColumns.map((col, colIdx) => (
//         <TableColumn key={colIdx} isFixed={col.header === '団体名'}>
//           <TableHeader>{col.header}</TableHeader>
//           {programs.map((program: UnionProgram) => {
//             const currentParticipant = participants.find((participant) => participant.id === program.participantId);
//             if (!currentParticipant) {
//               return null;
//             }
//             const value = currentParticipant[col.property as keyof typeof currentParticipant] as string;
//             return (
//               <TableCell
//                 key={`${program.id}-${colIdx}`}
//                 header={col.header}
//                 property={col.property}
//                 value={value}
//                 participantId={currentParticipant.id}
//                 participantSocialMedias={participantSocialMedias}
//                 target={target}
//                 rowHeight={rowHeights[program.id] || 0}
//                 setRowHeight={(height: number) => handleSetRowHeight(program.id, height)}
//                 isParticipantColumn={true}
//               />
//             );
//           })}
//         </TableColumn>
//       ))}
//       {programColumns.map((col, colIdx) => (
//         <TableColumn key={colIdx}>
//           <TableHeader>{col.header}</TableHeader>
//           {programs.map((program: UnionProgram) => {
//             if (hasProperty(program, col.property)) {
//               const value = program[col.property] as string | null;
//               const currentParticipant = participants.find((participant) => participant.id === program.participantId);
//               if (!currentParticipant) {
//                 return null;
//               }
//               return (
//                 <TableCell
//                   key={`${program.id}-${colIdx}`}
//                   header={col.header}
//                   property={col.property}
//                   programId={program.id}
//                   participantId={currentParticipant.id}
//                   value={value || ''}
//                   programContext={programContext}
//                   target={target}
//                   rowHeight={rowHeights[program.id] || 0}
//                   setRowHeight={(height: number) => handleSetRowHeight(program.id, height)}
//                   isParticipantColumn={false}
//                 />
//               );
//             }
//             return null;
//           })}
//         </TableColumn>
//       ))}
//     </div>
//   );
// }

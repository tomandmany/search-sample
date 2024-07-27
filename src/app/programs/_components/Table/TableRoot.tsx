// src/components/TableRoot.tsx
'use client'

import { useContext, useState } from "react";
import { ProgramContextType } from "@/app/programs/contexts/ProgramContext";
import TableColumn from "./TableColumn";
import TableHeader from "./TableHeader";
import TableCell from "./TableCell";
import { participantColumns } from "@/data/columns";

type TableRootProps = {
  programContext: React.Context<ProgramContextType | undefined>;
  programColumns: { header: string; property: string }[];
  department: 'booth' | 'outstage' | 'room';
};

type UnionProgram = {
  [key: string]: any; // あなたの実際のUnionProgram型を定義してください
};

function hasProperty<T extends object, K extends PropertyKey>(obj: T, key: K): obj is T & Record<K, unknown> {
  return key in obj;
}

export default function TableRoot({ programContext, programColumns, department }: TableRootProps) {
  const [rowHeights, setRowHeights] = useState<{ [key: string]: number }>({});

  const context = useContext(programContext);
  if (!context) {
    throw new Error('TableRoot must be used within a Provider');
  }
  const { programs, participants } = context;

  const handleSetRowHeight = (programId: string, height: number) => {
    setRowHeights((prev) => ({ ...prev, [programId]: height }));
  };

  return (
    <div className="flex max-w-fit mx-auto overflow-x-auto border-x border-t shadow-md hidden-scrollbar">
      {participantColumns.map((col, colIdx) => (
        <TableColumn key={colIdx} isFixed={col.header === '団体名'}>
          <TableHeader>{col.header}</TableHeader>
          {programs.map((program: UnionProgram) => {
            const currentParticipant = participants.find((participant) => participant.id === program.participantId);
            if (!currentParticipant) {
              return null;
            }
            const value = currentParticipant[col.property as keyof typeof currentParticipant] as string;
            return (
              <TableCell
                key={`${program.id}-${colIdx}`}
                header={col.header}
                value={value}
                participantId={currentParticipant.id}
                department={department}
                rowHeight={rowHeights[program.id] || 0}
                setRowHeight={(height: number) => handleSetRowHeight(program.id, height)}
              />
            );
          })}
        </TableColumn>
      ))}
      {programColumns.map((col, colIdx) => (
        <TableColumn key={colIdx}>
          <TableHeader>{col.header}</TableHeader>
          {programs.map((program: UnionProgram) => {
            if (hasProperty(program, col.property)) {
              const value = program[col.property] as string | null;
              const currentParticipant = participants.find((participant) => participant.id === program.participantId);
              if (!currentParticipant) {
                return null;
              }
              return (
                <TableCell
                  key={program.id}
                  header={col.header}
                  property={col.property}
                  programId={program.id}
                  participantId={currentParticipant.id}
                  value={value || ''}
                  programContext={programContext}
                  department={department}
                  rowHeight={rowHeights[program.id] || 0}
                  setRowHeight={(height: number) => handleSetRowHeight(program.id, height)}
                />
              );
            }
            return null;
          })}
        </TableColumn>
      ))}
    </div>
  );
}

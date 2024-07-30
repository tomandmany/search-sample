// src/components/TableRoot.tsx
'use client';

import { useState } from 'react';
import TableColumn from './TableColumn';
import TableHeader from './TableHeader';
import TableCell from './TableCell';
import { participantColumns } from '@/data/columns';

type TableRootProps = {
  participants: Participant[];
  participantSocialMedias: ParticipantSocialMedia[];
};

export default function TableRoot({
  participants,
  participantSocialMedias
}: TableRootProps) {
  const [maxWidths, setMaxWidths] = useState<{ [key: string]: number }>({});
  const [rowHeights, setRowHeights] = useState<{ [key: string]: number }>({});

  const setMaxWidth = (header: string, width: number) => {
    setMaxWidths((prevMaxWidths) => {
      if (!prevMaxWidths[header] || width > prevMaxWidths[header]) {
        return { ...prevMaxWidths, [header]: width };
      }
      return prevMaxWidths;
    });
  };

  const handleSetRowHeight = (participantId: string, height: number) => {
    setRowHeights((prev) => ({ ...prev, [participantId]: height }));
  };

  return (
    <div className="flex max-w-fit mx-auto overflow-x-auto border-x border-t shadow-md hidden-scrollbar">
      {participantColumns.map((col, colIdx) => (
        <TableColumn key={colIdx} isFixed={col.header === '団体名'}>
          <TableHeader>{col.header}</TableHeader>
          {
            participants.map((participant) => {
              const value = participant[col.property as keyof Participant] as string;
              return (
                <TableCell
                  key={`${participant.id}-${colIdx}`}
                  header={col.header}
                  property={col.property}
                  value={value}
                  participantId={participant.id}
                  participantSocialMedias={participantSocialMedias}
                  maxWidths={maxWidths}
                  setMaxWidth={setMaxWidth}
                  rowHeight={rowHeights[participant.id] || 0}
                  setRowHeight={(height: number) => handleSetRowHeight(participant.id, height)}
                  isParticipantColumn={true}
                />
              );
            })
          }
        </TableColumn>
      ))}
    </div>
  );
}

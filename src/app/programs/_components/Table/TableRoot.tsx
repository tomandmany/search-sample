// @filename: /src/components/TableRoot.tsx
'use client';

import TableColumn from './TableColumn';
import TableHeader from './TableHeader';
import TableCell from './TableCell';
import { participantColumns, boothProgramColumns, outstageProgramColumns, roomProgramColumns } from '@/data/columns';
import { useContext, useEffect, useState } from 'react';
import ProgramContext from '@/app/programs/contexts/ProgramContext';

type TableRootProps = {
  programs?: UnionProgram[];
  participants: Participant[];
  participantSocialMedias: ParticipantSocialMedia[];
  target?: Target;
};

export default function TableRoot({ programs, participants, participantSocialMedias, target }: TableRootProps) {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error('TableRoot must be used within a Provider');
  }
  const { setTarget } = context;

  const [programColumns, setProgramColumns] = useState<{ label: string; key: string }[]>([]);

  useEffect(() => {
    if (target !== 'participant') {
      setTarget(target!);
    }

    switch (target) {
      case 'booth':
        setProgramColumns(boothProgramColumns);
        break;
      case 'outstage':
        setProgramColumns(outstageProgramColumns);
        break;
      case 'room':
        setProgramColumns(roomProgramColumns);
        break;
      default:
        setProgramColumns([]);
        break;
    }
  }, [target, setTarget]);

  return (
    <div className="flex max-w-fit mx-auto overflow-x-auto border-x border-t shadow-md rounded-md hidden-scrollbar">
      {programs ? (
        <>
          {participantColumns.map((column) => (
            <TableColumn key={column.key} isFixed={column.key === 'participantName'}>
              <TableHeader>{column.label}</TableHeader>
              {programs.map((program) => {
                const filteredParticipant = participants.find((participant) => participant.id === program.participantId)!;
                const filteredParticipantSocialMedias = participantSocialMedias.filter(
                  (participantSocialMedia) => participantSocialMedia.participantId === filteredParticipant.id
                );
                return (
                  <TableCell
                    key={`${program.id}-${column.key}-participant`}
                    program={program}
                    participant={filteredParticipant}
                    participantSocialMedias={filteredParticipantSocialMedias}
                    columnKey={column.key}
                    isParticipantColumn={true}
                  />
                );
              })}
            </TableColumn>
          ))}
          {programColumns.map((column) => (
            <TableColumn key={column.key}>
              <TableHeader>{column.label}</TableHeader>
              {programs.map((program) => {
                const participant = participants.find((participant) => participant.id === program.participantId)!;
                const filteredParticipantSocialMedias = participantSocialMedias.filter(
                  (participantSocialMedia) => participantSocialMedia.participantId === participant.id
                );
                return (
                  <TableCell
                    key={`${program.id}-${column.key}-program`}
                    program={program}
                    participant={participant}
                    participantSocialMedias={filteredParticipantSocialMedias}
                    columnKey={column.key}
                    isParticipantColumn={false}
                  />
                );
              })}
            </TableColumn>
          ))}
        </>
      ) : (
        <>
          {participantColumns.map((column) => (
            <TableColumn key={column.key} isFixed={column.key === 'participantName'}>
              <TableHeader>{column.label}</TableHeader>
              {participants.map((participant) => {
                const filteredParticipantSocialMedias = participantSocialMedias.filter(
                  (participantSocialMedia) => participantSocialMedia.participantId === participant.id
                );
                return (
                  <TableCell
                    key={`${participant.id}-${column.key}-participant`}
                    participant={participant}
                    participantSocialMedias={filteredParticipantSocialMedias}
                    columnKey={column.key}
                    isParticipantColumn={true}
                  />
                );
              })}
            </TableColumn>
          ))}
        </>
      )}
    </div>
  );
}

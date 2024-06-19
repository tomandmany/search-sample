// @filename: /components/TableRoot.tsx

'use client';

import { useEffect, useState } from "react";
import TableCell from "./TableCell";
import TableColumn from "./TableColumn";
import TableHeader from "./TableHeader";
import { getPrograms } from "@/data/programs";
import { getParticipants } from "@/data/participants";
import { getParticipantChannels } from "@/data/participantChannels";
import { supabase } from "@/lib/supabaseClient";

// 各列のヘッダーとプロパティ名のマッピング
const columns = [
  { header: "フリガナ", property: "ruby" },
  { header: "企画名", property: "programName" },
  { header: "メッセージ", property: "message" },
  { header: "企画内容", property: "details" },
  { header: "撮影可否", property: "isPhotographable" },
  { header: "SNSアカウント", property: "channels" },
  { header: "ジャンル", property: "genre" },
  { header: "実施日", property: "eventDate" },
  { header: "実施場所", property: "venue" },
  { header: "開始時間", property: "startTime" },
  { header: "終了時間", property: "endTime" },
  { header: "イメージ図", property: "image" },
  { header: "公開日", property: "releaseDate" },
];

export default function TableRoot() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantChannels, setParticipantChannels] = useState<ParticipantChannel[]>([]);
  const [minHeight, setMinHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const programsData = await getPrograms();
      const participantsData = await getParticipants();
      const participantChannelsData = await getParticipantChannels();

      setPrograms(programsData);
      setParticipants(participantsData);
      setParticipantChannels(participantChannelsData);

      const programsChannel = supabase
        .channel('public:programs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'programs' }, (payload) => {
          const newProgram = payload.new as Program;
          setPrograms((prev) => [...prev, newProgram]);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'programs' }, (payload) => {
          const updatedProgram = payload.new as Program;
          setPrograms((prev) =>
            prev.map((program) =>
              program.id === updatedProgram.id ? updatedProgram : program
            )
          );
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'programs' }, (payload) => {
          const deletedProgram = payload.old as Program;
          setPrograms((prev) =>
            prev.filter((program) => program.id !== deletedProgram.id)
          );
        })
        .subscribe();

      const participantsChannel = supabase
        .channel('public:participants')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'participants' }, (payload) => {
          const newParticipant = payload.new as Participant;
          setParticipants((prev) => [...prev, newParticipant]);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'participants' }, (payload) => {
          const updatedParticipant = payload.new as Participant;
          setParticipants((prev) =>
            prev.map((participants) =>
              participants.id === updatedParticipant.id ? updatedParticipant : participants
            )
          );
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'participants' }, (payload) => {
          const deletedParticipant = payload.old as Participant;
          setParticipants((prev) =>
            prev.filter((participant) => participant.id !== deletedParticipant.id)
          );
        })
        .subscribe();
      
      const participantChannelsChannel = supabase
        .channel('public:participantChannels')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'participantChannels' }, (payload) => {
          const newParticipantChannel = payload.new as ParticipantChannel;
          setParticipantChannels((prev) => [...prev, newParticipantChannel]);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'participantChannels' }, (payload) => {
          const updatedParticipantChannel = payload.new as ParticipantChannel;
          setParticipantChannels((prev) =>
            prev.map((participantChannel) =>
              participantChannel.id === updatedParticipantChannel.id ? updatedParticipantChannel : participantChannel
            )
          );
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'participantChannels' }, (payload) => {
          const deletedParticipantChannel = payload.old as ParticipantChannel;
          setParticipantChannels((prev) =>
            prev.filter((participantChannel) => participantChannel.id !== deletedParticipantChannel.id)
          );
        })
        .subscribe();

      return () => {
        programsChannel.unsubscribe();
        participantsChannel.unsubscribe();
        participantChannelsChannel.unsubscribe();
      };
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (programs.length > 0) {
      setLoading(false);
    }
  }, [programs]);

  return (
    <form className="flex max-w-fit mx-auto overflow-x-auto border-l border-t">
      <TableColumn className="border-r-[3px] border-gray-300">
        <TableHeader>団体名</TableHeader>
        {loading ? (
          programs.map((program) => (
            <div key={program.id} className="border-b">
              <div className="w-[334px] h-[204px] bg-gray-300 animate-pulse m-4" />
            </div>
          ))
        ) : (
          programs.map((program) => {
            const currentParticipant = participants.find((participant) => participant.id === program.participantId);
            const currentParticipantChannels = participantChannels.filter((participantChannel) => participantChannel.participantId === currentParticipant?.id);
            return (
              <TableCell
                key={program.id}
                header="participantName"
                program={program}
                participant={currentParticipant!}
                participantChannel={currentParticipantChannels}
                minHeight={minHeight}
                setMinHeight={setMinHeight}
              />
            );
          })
        )}
      </TableColumn>
      <div className="flex overflow-x-auto border-r max-h-max">
        {columns.map((col, colIdx) => (
          <TableColumn key={colIdx}>
            <TableHeader>{col.header}</TableHeader>
            {loading ? (
              programs.map((program) => (
                <div key={program.id} className="border-b">
                  <div className="w-[334px] h-[204px] bg-gray-300 animate-pulse m-4" />
                </div>
              ))
            ) : (
              programs.map((program) => {
                const currentParticipant = participants.find((participant) => participant.id === program.participantId);
                const currentParticipantChannels = participantChannels.filter((participantChannel) => participantChannel.participantId === currentParticipant?.id);
                return (
                  <TableCell
                    key={program.id + col.property}
                    header={col.property}
                    program={program}
                    participant={currentParticipant!}
                    participantChannel={currentParticipantChannels}
                    minHeight={minHeight}
                    setMinHeight={setMinHeight}
                  />
                );
              })
            )}
          </TableColumn>
        ))}
      </div>
    </form>
  );
}

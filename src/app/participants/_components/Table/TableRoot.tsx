// @filename: /components/TableRoot.tsx

'use client'

import { useEffect, useState } from "react";
import TableCell from "./TableCell";
import TableColumn from "./TableColumn";
import TableHeader from "./TableHeader";
import { supabase } from "@/lib/supabaseClient";
import { getParticipants } from "@/data/participants";
import { getParticipantChannels } from "@/data/participantChannels";

// 各列のヘッダーとプロパティ名のマッピング
const columns = [
  { header: "フリガナ", property: "ruby" },
  { header: "SNSアカウント", property: "channels" },
  // { header: "イメージ図", property: "image" },
];

export default function TableRoot() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantChannels, setParticipantChannels] = useState<ParticipantChannel[]>([]);
  const [minHeight, setMinHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const participantsData = await getParticipants();
      const participantChannelsData = await getParticipantChannels();

      setParticipants(participantsData);
      setParticipantChannels(participantChannelsData);

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
        participantsChannel.unsubscribe();
        participantChannelsChannel.unsubscribe();
      };
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (participants.length > 0) {
      setLoading(false);
    }
  }, [participants]);
  
  return (
    <form className="flex max-w-fit border-l border-t">
      <TableColumn className="border-r-[3px] border-gray-300">
        <TableHeader loading={loading}>団体名</TableHeader>
        {loading ? (
          participants.map((participant) => (
            <div key={participant.id} className=" border-b">
              <div className="w-[334px] h-[204px] bg-gray-300 animate-pulse m-4" />
            </div>
          ))
        ) : (
            participants.map((participant) => {
            return (
              <TableCell
                key={participant.id}
                header="participantName"
                participant={participant}
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
            <TableHeader loading={loading}>{col.header}</TableHeader>
            {loading ? (
              participants.map((participant) => (
                <div key={participant.id} className=" border-b">
                  <div className="w-[334px] h-[204px] bg-gray-300 animate-pulse m-4" />
                </div>
              ))
            ) : (
              participants.map((participant) => {
                const currentParticipantChannels = participantChannels.filter((participantChannel) => participantChannel.participantId === participant?.id);
                return (
                  <TableCell
                    key={participant.id + col.property}
                    header={col.property}
                    participant={participant}
                    participantChannels={currentParticipantChannels}
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

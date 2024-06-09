// /data/programs.ts
// @filename: /data/programs.ts

import { supabase } from '@/lib/supabaseClient';

export async function getPrograms() {
  const { data, error } = await supabase.from('programs').select('*');
  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }
  return data;
}

export async function getProgramsAndParticipants() {
  const programs = await getPrograms();
  
  // nullでないparticipantIdを抽出
  const participantIds = programs
    .map((program) => program.participantId)
    .filter((id): id is string => id !== null);

  const { data: participants, error: participantsError } = await supabase
    .from('participants')
    .select('*')
    .in('id', participantIds);

  if (participantsError) {
    console.error('Error fetching participants:', participantsError);
    return { programs, participants: [] };
  }

  return { programs, participants };
}

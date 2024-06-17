// /data/participantChannels.ts
// @filename: /data/participantChannels.ts

import { supabase } from '@/lib/supabaseClient';

export async function getParticipantChannels() {
  const { data, error } = await supabase.from('participantChannels').select('*');
  if (error) {
    console.error('Error fetching participantChannels:', error);
    return [];
  }
  return data;
}
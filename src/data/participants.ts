// /data/participants.ts
// @filename: /data/participants.ts

import { supabase } from '@/lib/supabaseClient';

export async function getParticipants() {
  const { data, error } = await supabase.from('participants').select('*');
  if (error) {
    console.error('Error fetching participants:', error);
    return [];
  }
  return data;
}
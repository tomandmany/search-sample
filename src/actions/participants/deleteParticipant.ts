// パス: /actions/participants/deleteParticipant.ts
import { supabase } from '@/lib/supabaseClient';

interface Response {
  success: boolean;
  error?: any;
}

export default async function deleteParticipant(id: string): Promise<Response> {
  const { error } = await supabase.from('participants').delete().eq('id', id);

  if (error) {
    console.error('Error deleting Program:', error);
    return { success: false, error };
  }

  return { success: true };
}

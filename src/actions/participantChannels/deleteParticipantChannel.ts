// @filename: /actions/participantChannels/deleteParticipantChannel.ts
import { supabase } from '@/lib/supabaseClient';

interface Response {
  success: boolean;
  error?: any;
}

export default async function deleteParticipantChannel(
  id: string
): Promise<Response> {
  const { error } = await supabase
    .from('participantChannels')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting ParticipantChannel:', error);
    return { success: false, error };
  }

  return { success: true };
}

// パス: /actions/participantChannels/updateParticipantChannel.ts
import { supabase } from '@/lib/supabaseClient';
import { TablesUpdate } from '@/types/supabase.types';

interface Response {
  success: boolean;
  data?: TablesUpdate<'participantChannels'> | null;
  error?: any;
}

export default async function updateParticipantChannel(
  formData: FormData
): Promise<Response> {
  const id = formData.get('id') as string;

  if (!id) {
    console.error('No ID provided');
    return { success: false, error: 'No ID provided', data: null };
  }

  const updatedParticipantChannel: TablesUpdate<'participantChannels'> = {};
  formData.forEach((value, key) => {
    if (key !== 'id') {
      updatedParticipantChannel[
        key as keyof TablesUpdate<'participantChannels'>
      ] = value as any;
    }
  });

  const { data, error } = await supabase
    .from('participantChannels')
    .update(updatedParticipantChannel)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error updating participantChannel:', error);
    return { success: false, error, data: null };
  }

  return { success: true, data };
}

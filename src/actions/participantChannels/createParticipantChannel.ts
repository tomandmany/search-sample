// パス: /actions/participantChannels/createParticipantChannel.ts
import { supabase } from '@/lib/supabaseClient';
import { TablesInsert } from '@/types/supabase.types';

interface Response {
  success: boolean;
  data?: TablesInsert<'participantChannels'> | null;
  error?: any;
}

export default async function createParticipantChannel(
  formData: FormData
): Promise<Response> {
  const newParticipantChannel: Partial<TablesInsert<'participantChannels'>> =
    {};
  formData.forEach((value, key) => {
    newParticipantChannel[key as keyof TablesInsert<'participantChannels'>] =
      value as any;
  });

  const { data, error } = await supabase
    .from('participantChannels')
    .insert([newParticipantChannel])
    .single();

  if (error) {
    console.error('Error creating participantChannel:', error);
    return { success: false, error, data: null };
  }

  console.log('Inserted data:', data);

  return { success: true, data };
}

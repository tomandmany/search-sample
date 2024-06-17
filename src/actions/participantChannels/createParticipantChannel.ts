// @filename: /actions/participantChannels/createParticipantChannel.ts
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
  const newParticipantChannel: TablesInsert<'participantChannels'> = {
    participantId: '',
    channelModelId: '',
    url: '',
  };

  formData.forEach((value, key) => {
    newParticipantChannel[key as keyof TablesInsert<'participantChannels'>] =
      value as any;
  });

  if (
    !newParticipantChannel.participantId ||
    !newParticipantChannel.channelModelId
  ) {
    console.error('Invalid UUID for participantId or channelModelId');
    return {
      success: false,
      error: 'Invalid UUID for participantId or channelModelId',
      data: null,
    };
  }

  const { data, error } = await supabase
    .from('participantChannels')
    .insert([newParticipantChannel])
    .select(); // <--- .select()を追加

  if (error) {
    console.error('Error creating participantChannel:', error);
    return { success: false, error, data: null };
  }

  return { success: true, data: data[0] }; // 返されるデータを修正
}

// src/actions/participantSocialMedia/createParticipantSocialMedia.ts
'use server';
import { supabase } from '@/lib/supabaseClient';
import { TablesInsert } from '@/types/supabase.types';
import { revalidatePath } from 'next/cache';

interface Response {
  success: boolean;
  data?: TablesInsert<'participantSocialMedias'> | null;
  error?: any;
}

export default async function createParticipantSocialMedia(
  formData: FormData,
  department: 'booth' | 'outstage' | 'room'
): Promise<Response> {
  const newParticipantSocialMedia: Omit<
    TablesInsert<'participantSocialMedias'>,
    'id' | 'createdAt'
  > = {
    channelModelId: formData.get('channelModelId') as string,
    participantId: formData.get('participantId') as string,
    url: formData.get('url') as string,
  };

  console.log(
    'Creating new Participant Social Media:',
    newParticipantSocialMedia
  );

  const { data, error } = await supabase
    .from('participantSocialMedias')
    .insert([newParticipantSocialMedia])
    .select()
    .single();

  if (error) {
    console.error('Error creating participantSocialMedia:', error);
    return { success: false, error, data: null };
  }

  console.log('Inserted data:', data);

  revalidatePath(`/programs/${department}`);

  return { success: true, data };
}

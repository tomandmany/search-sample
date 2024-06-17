// パス: /actions/participants/createParticipant.ts
import { supabase } from '@/lib/supabaseClient';
import { TablesInsert } from '@/types/supabase.types';

interface Response {
  success: boolean;
  data?: TablesInsert<'participants'> | null;
  error?: any;
}

export default async function createParticipant(
  formData: FormData
): Promise<Response> {
  const newParticipant: TablesInsert<'participants'> = {};
  formData.forEach((value, key) => {
    newParticipant[key as keyof TablesInsert<'participants'>] = value as any;
  });

  const { data, error } = await supabase
    .from('participants')
    .insert([newParticipant])
    .single();

  if (error) {
    console.error('Error creating participant:', error);
    return { success: false, error, data: null };
  }

  return { success: true, data };
}

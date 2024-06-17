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
  const newProgram: TablesInsert<'participants'> = {};
  formData.forEach((value, key) => {
    newProgram[key as keyof TablesInsert<'participants'>] = value as any;
  });

  const { data, error } = await supabase
    .from('participants')
    .insert([newProgram])
    .single();

  if (error) {
    console.error('Error creating program:', error);
    return { success: false, error, data: null };
  }

  return { success: true, data };
}

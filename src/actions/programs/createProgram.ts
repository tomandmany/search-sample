// パス: /actions/programs/createProgram.ts
import { supabase } from '@/lib/supabaseClient';
import { TablesInsert } from '@/types/supabase.types';

interface Response {
  success: boolean;
  data?: TablesInsert<'programs'> | null;
  error?: any;
}

export default async function createProgram(
  formData: FormData
): Promise<Response> {
  const newProgram: TablesInsert<'programs'> = {};
  formData.forEach((value, key) => {
    newProgram[key as keyof TablesInsert<'programs'>] = value as any;
  });

  const { data, error } = await supabase
    .from('programs')
    .insert([newProgram])
    .single();

  if (error) {
    console.error('Error creating program:', error);
    return { success: false, error, data: null };
  }

  return { success: true, data };
}

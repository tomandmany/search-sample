// パス: /actions/programs/updateProgram.ts
import { supabase } from '@/lib/supabaseClient';
import { TablesUpdate } from '@/types/supabase.types';

interface Response {
  success: boolean;
  data?: TablesUpdate<'programs'> | null;
  error?: any;
}

export default async function updateProgram(
  formData: FormData
): Promise<Response> {
  const id = formData.get('id') as string;

  if (!id) {
    console.error('No ID provided');
    return { success: false, error: 'No ID provided', data: null };
  }

  const updatedProgram: TablesUpdate<'programs'> = {};
  formData.forEach((value, key) => {
    if (key !== 'id') {
      updatedProgram[key as keyof TablesUpdate<'programs'>] = value as any;
    }
  });

  const { data, error } = await supabase
    .from('programs')
    .update(updatedProgram)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error updating program:', error);
    return { success: false, error, data: null };
  }

  return { success: true, data };
}
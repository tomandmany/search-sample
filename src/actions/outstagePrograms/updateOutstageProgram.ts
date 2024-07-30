'use server'
import { supabase } from '@/lib/supabaseClient';
import { TablesUpdate } from '@/types/supabase.types';
import { revalidatePath } from 'next/cache';

interface Response {
  success: boolean;
  data?: TablesUpdate<'outstagePrograms'> | null;
  error?: any;
}

export default async function updateOutstageProgram(
  formData: FormData,
): Promise<Response> {
  const id = formData.get('id') as string;

  if (!id) {
    console.error('No ID provided');
    return { success: false, error: 'No ID provided', data: null };
  }

  const updatedProgram: TablesUpdate<'outstagePrograms'> = {};
  formData.forEach((value, key) => {
    if (key !== 'id') {
      updatedProgram[key as keyof TablesUpdate<'outstagePrograms'>] =
        value as any;
    }
  });

  const { data, error } = await supabase
    .from('outstagePrograms')
    .update(updatedProgram)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating program:', error);
    return { success: false, error, data: null };
  }

  console.log('Update response data:', data);

  revalidatePath(`/programs/outstage`);

  return { success: true, data };
}

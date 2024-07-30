// actions/outstageProgram/updateOutstageProgram.ts
'use server';
import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

interface Response {
  success: boolean;
  data?: OutstageProgram;
  error?: any;
}

const tableName = 'outstagePrograms';

export default async function updateOutstageProgram(
  formData: FormData
): Promise<Response> {
  const id = formData.get('id') as string;

  if (!id) {
    console.error('No ID provided');
    return { success: false, error: 'No ID provided' };
  }

  const updatedProgram: Partial<OutstageProgram> = {};
  formData.forEach((value, key) => {
    if (key !== 'id') {
      updatedProgram[key as keyof OutstageProgram] = value as any;
    }
  });

  console.log('Updating table:', tableName);
  console.log('Updated data:', updatedProgram);

  const { data, error } = await supabase
    .from(tableName)
    .update(updatedProgram)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating program:', error);
    return { success: false, error };
  }

  console.log('Update response data:', data);

  revalidatePath('/sampleOutstagePrograms'); // idを含むパスをリバリデート

  return { success: true, data };
}

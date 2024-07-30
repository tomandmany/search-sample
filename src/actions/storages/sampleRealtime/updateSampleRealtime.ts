// actions/sampleRealtime/updateSampleRealtime.ts
'use server';
import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

interface Response {
  success: boolean;
  data?: SampleRealtime;
  error?: any;
}

const tableName = 'sampleRealtime';

export default async function updateSampleRealtime(
  formData: FormData
): Promise<Response> {
  const id = formData.get('id') as string;

  if (!id) {
    console.error('No ID provided');
    return { success: false, error: 'No ID provided', data: undefined };
  }

  const updatedProgram: Partial<SampleRealtime> = {};
  formData.forEach((value, key) => {
    if (key !== 'id') {
      updatedProgram[key as keyof SampleRealtime] = value as any;
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
    return { success: false, error, data: undefined };
  }

  console.log('Update response data:', data);

  revalidatePath(`/sampleRealtime`);

  return { success: true, data };
}

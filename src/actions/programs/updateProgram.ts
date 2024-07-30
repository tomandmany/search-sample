'use server';
import { supabase } from '@/lib/supabaseClient';
import { TablesUpdate } from '@/types/supabase.types';
import { revalidatePath } from 'next/cache';

interface Response<T> {
  success: boolean;
  data?: T | null;
  error?: any;
}

export default async function updateProgram(
  formData: FormData,
  target: Target
): Promise<Response<TablesUpdate<typeof tableName>>> {
  const id = formData.get('id') as string;
  if (target === 'participant') {
    console.error('Invalid target:', target);
    return { success: false, error: 'Invalid target', data: null };
  }
  const tableName: TableName = `${target}Programs` as const;

  if (!id) {
    console.error('No ID provided');
    return { success: false, error: 'No ID provided', data: null };
  }

  const updatedProgram: Partial<TablesUpdate<typeof tableName>> = {};
  formData.forEach((value, key) => {
    if (key !== 'id') {
      updatedProgram[key as keyof TablesUpdate<typeof tableName>] =
        value as any;
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
    return { success: false, error, data: null };
  }

  console.log('Update response data:', data);

  revalidatePath(`/programs/${target}`);

  return { success: true, data };
}

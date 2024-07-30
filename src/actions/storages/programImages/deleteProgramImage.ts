// @filename: /actions/storages/programImages/deleteProgramImage.ts
'use server';

import { supabase } from '@/lib/supabaseClient';

interface Response<T> {
  success: boolean;
  error?: any;
}

export default async function deleteProgramImage(
  id: string,
  fileName: string,
  target: 'booth' | 'outstage' | 'room'
): Promise<Response<typeof tableName>> {
  const tableName = `${target}Programs` as const;

  if (!id || !fileName) {
    console.error('No ID or fileName provided');
    return { success: false, error: 'No ID or fileName provided' };
  }

  const filePath = `${id}/${fileName}`;
  const { error: removeError } = await supabase.storage
    .from('programImages')
    .remove([filePath]);

  console.log(`Deleting file: ${filePath}`);

  if (removeError) {
    console.error('Error deleting file:', removeError);
    return { success: false, error: removeError };
  }

  const { data, error: updateError } = await supabase
    .from(tableName)
    .update({ programImage: null })
    .eq('id', id)
    .single();

  if (updateError) {
    console.error('Error updating program:', updateError);
    return { success: false, error: updateError };
  }

  return { success: true };
}

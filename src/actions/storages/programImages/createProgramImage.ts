// app/actions/storages/programImages/createProgramImage.ts

// ファイルのパス
'use server';

import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

interface Response {
  success: boolean;
  error?: any;
  url?: string;
}

export default async function createProgramImage(
  formData: FormData,
  target: Target
): Promise<Response> {
  const file = formData.get('file') as File;
  const programName = formData.get('programName') as File;

  if (target === 'participant') {
    console.error('Invalid target:', target);
    return { success: false, error: 'Invalid target' };
  }

  if (!file) {
    console.error('No ID or file provided');
    return { success: false, error: 'No ID or file provided' };
  }

  const fileName = `${programName}/${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('programImages')
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    return { success: false, error: uploadError };
  }

  const { data: urlData } = supabase.storage
    .from('programImages')
    .getPublicUrl(fileName);

  const publicUrl = urlData.publicUrl;

  revalidatePath(`/programs/${target}`);

  return { success: true, url: publicUrl };
}

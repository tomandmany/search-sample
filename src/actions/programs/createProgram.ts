'use server';

import { supabase } from '@/lib/supabaseClient';
import { TablesInsert } from '@/types/supabase.types';
import { revalidatePath } from 'next/cache';

interface Response<T> {
  success: boolean;
  data?: T | null;
  error?: any;
}

export default async function createProgram(
  formData: FormData,
  target: Target
): Promise<Response<TablesInsert<typeof tableName>>> {
  if (target === 'participant') {
    console.error('Invalid target:', target);
    return { success: false, error: 'Invalid target', data: null };
  }
  const tableName: TableName = `${target}Programs` as const;

  const newProgram: Partial<TablesInsert<typeof tableName>> = {};
  formData.forEach((value, key) => {
    if (key !== 'id') {
      newProgram[key as keyof TablesInsert<typeof tableName>] = value as any;
    }
  });

  const { data, error } = await supabase
    .from(tableName)
    .insert([newProgram])
    .single();

  if (error) {
    console.error('Error creating program:', error);
    return { success: false, error, data: null };
  }

  revalidatePath(`/programs/${target}`);

  return { success: true, data };
}

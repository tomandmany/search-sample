// パス: /actions/programs/deleteProgram.ts
import { supabase } from '@/lib/supabaseClient';

interface Response {
  success: boolean;
  error?: any;
}

export default async function deleteProgram(id: string): Promise<Response> {
  const { error } = await supabase.from('programs').delete().eq('id', id);

  if (error) {
    console.error('Error deleting Program:', error);
    return { success: false, error };
  }

  return { success: true };
}

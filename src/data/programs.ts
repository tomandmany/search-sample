import { supabase } from '@/lib/supabaseClient';

export async function getPrograms(): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('createdAt', { ascending: true }); // 例としてcreated_atで昇順に並び替え

  if (error) {
    throw new Error(error.message);
  }

  return data as Program[];
}

export async function getProgramById(id: string): Promise<Program> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Program;
}

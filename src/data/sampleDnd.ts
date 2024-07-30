import { supabase } from '@/lib/supabaseClient';

export async function getSampleDnd() {
  const { data, error } = await supabase
    .from('sampleDnd')
    .select('*')
    .order('rowsOrder', { ascending: true });
  if (error) {
    console.error('Error fetching participants:', error);
    return [];
  }
  return data;
}
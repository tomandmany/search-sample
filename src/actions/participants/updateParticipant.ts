// パス: /actions/participants/updateParticipant.ts
import { supabase } from '@/lib/supabaseClient';
import { TablesUpdate } from '@/types/supabase.types';

interface Response {
  success: boolean;
  data?: TablesUpdate<'participants'> | null;
  error?: any;
}

export default async function updateParticipant(
  formData: FormData
): Promise<Response> {
  const id = formData.get('id') as string;

  if (!id) {
    console.error('No ID provided');
    return { success: false, error: 'No ID provided', data: null };
  }

  const updatedParticipant: TablesUpdate<'participants'> = {};
  formData.forEach((value, key) => {
    if (key !== 'id') {
      updatedParticipant[key as keyof TablesUpdate<'participants'>] = value as any;
    }
  });

  const { data, error } = await supabase
    .from('participants')
    .update(updatedParticipant)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error updating Participant:', error);
    return { success: false, error, data: null };
  }

  return { success: true, data };
}
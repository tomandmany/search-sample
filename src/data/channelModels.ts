// /data/channelModels.ts
// @filename: /data/channelModels.ts

import { supabase } from '@/lib/supabaseClient';

export async function getChannelModels() {
  const { data, error } = await supabase.from('channelModels').select('*');
  if (error) {
    console.error('Error fetching channelModels:', error);
    return [];
  }
  return data;
}
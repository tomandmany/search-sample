import { Tables } from './supabase.types';

declare global {
  type Program = Tables<'programs'>;
  type Participant = Tables<'participants'>;
}

import { Tables } from './supabase.types';

declare global {
  // type Program = Tables<'programs'>;
  type BoothProgram = Tables<'boothPrograms'>;
  type OutstageProgram = Tables<'outstagePrograms'>;
  type RoomProgram = Tables<'roomPrograms'>;
  type UnionProgram = BoothProgram | OutstageProgram | RoomProgram;
  type Participant = Tables<'participants'>;
  type ParticipantSocialMedia = Tables<'participantSocialMedias'>;
  type SocialMediaModel = Tables<'socialMediaModels'>;
  type Target = 'participant' | 'booth' | 'outstage' | 'room';
  type TableName = 'boothPrograms' | 'outstagePrograms' | 'roomPrograms';
  type Column = { label: string; key: string };
}

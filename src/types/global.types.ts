import { Tables } from './supabase.types';

declare global {
  type Program = Tables<'programs'>;
  type BoothProgram = Tables<'boothPrograms'>;
  type OutstageProgram = Tables<'outstagePrograms'>;
  type RoomProgram = Tables<'roomPrograms'>;
  type UnionProgram =
    | BoothProgram
    | OutstageProgram
    | RoomProgram;

  type Participant = Tables<'participants'>;
  type ParticipantChannel = Tables<'participantChannels'>;
  type ParticipantSocialMedia = Tables<'participantSocialMedias'>;
  type ChannelModel = Tables<'channelModels'>;
  type SocialMediaModel = Tables<'socialMediaModels'>;
}

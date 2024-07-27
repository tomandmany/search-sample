// src/app/programs/contexts/ProgramProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import ProgramContext from './ProgramContext';
import { supabase } from '@/lib/supabaseClient';

type ProgramProviderProps = {
    programs: UnionProgram[];
    participants: Participant[];
    participantSocialMedias: ParticipantSocialMedia[];
    children: React.ReactNode;
}

const ProgramProvider = ({ programs: initialPrograms, participants: initialParticipants, participantSocialMedias: initialParticipantSocialMedias, children }: ProgramProviderProps) => {
    const [programs, setPrograms] = useState(initialPrograms);
    const [participants, setParticipants] = useState(initialParticipants);
    const [participantSocialMedias, setParticipantSocialMedias] = useState(initialParticipantSocialMedias);
    // const [minHeight, setMinHeight] = useState<number>(0);
    const [maxWidths, setMaxWidths] = useState<{ [key: string]: number }>({});

    const setMaxWidth = (header: string, width: number) => {
        setMaxWidths((prevMaxWidths) => {
            if (!prevMaxWidths[header] || width > prevMaxWidths[header]) {
                return { ...prevMaxWidths, [header]: width };
            }
            return prevMaxWidths;
        });
    };

    useEffect(() => {
        const programsChannel = supabase
            .channel('public:programs')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'programs' }, (payload) => {
                const newProgram = payload.new as UnionProgram;
                setPrograms((prev) => [...prev, newProgram]);
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'programs' }, (payload) => {
                const updatedProgram = payload.new as UnionProgram;
                setPrograms((prev) =>
                    prev.map((program) =>
                        program.id === updatedProgram.id ? updatedProgram : program
                    )
                );
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'programs' }, (payload) => {
                const deletedProgram = payload.old as UnionProgram;
                setPrograms((prev) =>
                    prev.filter((program) => program.id !== deletedProgram.id)
                );
            })
            .subscribe();

        const participantsChannel = supabase
            .channel('public:participants')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'participants' }, (payload) => {
                const newParticipant = payload.new as Participant;
                setParticipants((prev) => [...prev, newParticipant]);
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'participants' }, (payload) => {
                const updatedParticipant = payload.new as Participant;
                setParticipants((prev) =>
                    prev.map((participants) =>
                        participants.id === updatedParticipant.id ? updatedParticipant : participants
                    )
                );
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'participants' }, (payload) => {
                const deletedParticipant = payload.old as Participant;
                setParticipants((prev) =>
                    prev.filter((participant) => participant.id !== deletedParticipant.id)
                );
            })
            .subscribe();

        const participantSocialMediasChannel = supabase
            .channel('public:participantSocialMedias')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'participantSocialMedias' }, (payload) => {
                const newParticipantSocialMedia = payload.new as ParticipantSocialMedia;
                setParticipantSocialMedias((prev) => [...prev, newParticipantSocialMedia]);
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'participantSocialMedias' }, (payload) => {
                const updatedParticipantSocialMedia = payload.new as ParticipantSocialMedia;
                setParticipantSocialMedias((prev) =>
                    prev.map((participantSocialMedia) =>
                        participantSocialMedia.id === updatedParticipantSocialMedia.id ? updatedParticipantSocialMedia : participantSocialMedia
                    )
                );
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'participantSocialMedias' }, (payload) => {
                const deletedParticipantSocialMedia = payload.old as ParticipantSocialMedia;
                setParticipantSocialMedias((prev) =>
                    prev.filter((participantSocialMedia) => participantSocialMedia.id !== deletedParticipantSocialMedia.id)
                );
            })
            .subscribe();

        return () => {
            programsChannel.unsubscribe();
            participantsChannel.unsubscribe();
            participantSocialMediasChannel.unsubscribe();
        };
    }, []);

    return (
        <ProgramContext.Provider value={{ programs, participants, participantSocialMedias, maxWidths, setMaxWidth }}>
        {/* <ProgramContext.Provider value={{ programs, participants, participantSocialMedias, minHeight, setMinHeight, maxWidths, setMaxWidth }}> */}
            {children}
        </ProgramContext.Provider>
    );
};

export default ProgramProvider;

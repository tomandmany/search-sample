// app/components/component.tsx
'use client';

import { useEffect, useState } from 'react';
import updateOutstageProgram from '@/actions/sampleOutstagePrograms/updateSampleOutstageProgram';
import { supabase } from '@/lib/supabaseClient';
import { KeyboardEvent as ReactKeyboardEvent, FocusEvent as ReactFocusEvent } from 'react';
import InputField from './InputField';

type Props = {
    id: string;
    program: OutstageProgram;
};

export default function Component({ id, program: initialProgram }: Props) {
    const [program, setProgram] = useState<OutstageProgram>(initialProgram);

    useEffect(() => {
        const outstageProgramChannel = supabase
            .channel('public:outstagePrograms')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'outstagePrograms' }, (payload) => {
                const updatedOutstageProgram = payload.new as OutstageProgram;
                if (updatedOutstageProgram.id === id) {
                    setProgram(updatedOutstageProgram);
                }
            })
            .subscribe();

        return () => {
            outstageProgramChannel.unsubscribe();
        };
    }, [id]);

    const handleValueChange = (field: keyof OutstageProgram, value: string) => {
        setProgram(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div>
            {Object.keys(program).map((key) => (
                <InputField
                    key={key}
                    id={id}
                    field={key as keyof OutstageProgram}
                    value={program[key as keyof OutstageProgram] as string}
                    onValueChange={handleValueChange}
                />
            ))}
        </div>
    );
}

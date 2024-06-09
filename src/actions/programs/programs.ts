// パス: /actions/programs.ts
// @filename: /actions/programs.ts
'use server';

import createProgram from '@/actions/programs/createProgram';
import updateProgram from '@/actions/programs/updateProgram';
import deleteProgram from '@/actions/programs/deleteProgram';

export { createProgram, updateProgram, deleteProgram };
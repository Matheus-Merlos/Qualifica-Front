import { atomWithStorage } from 'jotai/utils';

export const userIdAtom = atomWithStorage('userId', null);
export const nameAtom = atomWithStorage('name', null);
export const emailAtom = atomWithStorage('email', null);
export const tokenAtom = atomWithStorage('token', '');
export const bioAtom = atomWithStorage('bio', null);

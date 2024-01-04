import { atom } from "jotai";

export const speedLimitAtom = atom({
    min: 8.0,
    max: 15.0,
});

export const jumpLimitAtom = atom({
    min: 2.0,
    max: 5.5,
});

export const styleAtom = atom<String[]>([]);
export const colorAtom = atom<String[]>([]);

export const horseAliveAtom = atom(false);

export const expandAtom = atom(false);

export const pagesAtom = atom(1);
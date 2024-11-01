import { create } from "zustand";

// import { createContext, useContext, useEffect, useState } from "react";

export const useTranspositionNumberStore = create((set) => ({
    transpositionNumber: 0,
    transposeUp: () => set((state) => ({transpositionNumber: state.transpositionNumber + 1})),
    transposeDown: () => set((state) => ({transpositionNumber: state.transpositionNumber - 1})),
}));

export const useChordsStore = create((set) => ({
    chords: [],
    transposedChords: [],
    addChords: (chordBlock) => set((state) => ({chords: [...state.chords, chordBlock]})),
    addTransposedChords: (transposedChord) => set((state) => ({transposedChords: [...state.transposedChords, transposedChord]})),
    resetTransposedChords: () => set((state) => ({transposedChords: []})),
}));

// export const useSongStore = create((set) => ({
//     note: null,
//     songData: [],
//     setSongData: (data) => set((state) => ({...state.songData, ...data})),
//     setName: (e) => set((state) => ({noteData: {...state.noteData, name: e}})),
//     setContent: (e) => set((state) => ({noteData: {...state.noteData, content: e}})),

//     logIn: (userData) => set((state) => ({user: userData})),
// }));
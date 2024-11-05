import { create } from "zustand";

export const useTranspositionNumberStore = create((set) => ({
  transpositionNumber: 0,
  transposeUp: () => set((state) => ({ transpositionNumber: state.transpositionNumber + 1 })),
  transposeDown: () => set((state) => ({ transpositionNumber: state.transpositionNumber - 1 })),
}));

export const useChordsStore = create((set) => ({
  chords: [],
  transposedChords: [],
  addChords: (chordBlock) => set((state) => ({ chords: [...state.chords, chordBlock] })),
  addTransposedChords: (transposedChord) => set((state) => ({ transposedChords: [...state.transposedChords, transposedChord] })),
  resetTransposedChords: () => set((state) => ({ transposedChords: [] })),
}));

export const useSongContentStore = create((set) => ({
  songMetaData: {title: '', artist: '', key: '', capo: 0},
  content: '',
  setContent: (e) => set((state) => ({ content:  e})),
  addTemplate: (template) => set((state) => ({content: state.content + template})),
  setTitle: (e) => set((state) => ({ songMetaData: { ...state.songMetaData, title: e } })),
  setArtist: (e) => set((state) => ({ songMetaData: { ...state.songMetaData, artist: e } })),
  setKey: (e) => set((state) => ({ songMetaData: { ...state.songMetaData, key: e } })),
  setCapo: (e) => set((state) => ({ songMetaData: { ...state.songMetaData, capo: e } })),
}));

export const useTranspositionStore = create((set) => ({
  transposition: false,
  transpose: () => set((state) => ({ transposition: !state.transposition })),
  
}));
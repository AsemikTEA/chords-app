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
  songMetaData: { version: 0, title: '', artist: '', key: '', capo: 0 },
  content: '',
  setContent: (e) => set((state) => ({ content: e })),
  addTemplate: (template) => set((state) => ({ content: state.content + template })),
  setTitle: (e) => set((state) => ({ songMetaData: { ...state.songMetaData, title: e } })),
  setArtist: (e) => set((state) => ({ songMetaData: { ...state.songMetaData, artist: e } })),
  setKey: (e) => set((state) => ({ songMetaData: { ...state.songMetaData, key: e } })),
  setCapo: (e) => set((state) => ({ songMetaData: { ...state.songMetaData, capo: e } })),
  setVersion: (e) => set((state) => ({ songMetaData: { ...state.songMetaData, version: e } })),
}));

export const useTranspositionStore = create((set) => ({
  transposition: false,
  transpose: () => set((state) => ({ transposition: !state.transposition })),
}));

export const useSearchStore = create((set) => ({
  songName: '',
  setSongName: (e) => set((state) => ({ songName: e })),
}));

export const useSongVersionStore = create((set) => ({
  songId: '',
  versionId: '',
  setSongId: (e) => set((state) => ({ songId: e })),
  setVersionId: (e) => set((state) => ({ versionId: e })),
}));
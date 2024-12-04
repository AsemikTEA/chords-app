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

export const useUserStore = create((set) => ({
  user: {id: '', username: '', email: '', token: ''},
  logInData: {email: '', password: ''},
  setId: (e) => set((state) => ({ user: { ...state.user, id: e }})),
  setUsername: (e) => set((state) => ({ user: { ...state.user, username: e }})),
  setEmail: (e) => set((state) => ({ user: { ...state.user, email: e }})),
  setToken: (e) => set((state) => ({ user: { ...state.user, token: e }})),
  setLogInEmail: (e) => set((state) => ({ logInData: { ...state.logInData, email: e }})),
  setLogInPassword: (e) => set((state) => ({ logInData: { ...state.logInData, password: e }})),
}));

export const usePlaylistStore = create((set) => ({
  playlistId: '',
  playlistSongs: [],
  playlistName: '',
  setPlaylistId: (e) => set((state) => ({ playlistId: e })),
  setPlaylistSong: (songId) => set((state) => ({ playlistSongs: [...state.playlistSongs, songId] })),
  setPlaylistName: (e) => set((state) => ({ playlistName: e })),
}));

export const useModalStore = create((set) => ({
  modalVisible: false,
  modalOptions: false,
  setModalVisible: () => set((state) => ({ modalVisible: !state.modalVisible })),
  setModalOptions: () => set((state) => ({ modalOptions: !state.modalOptions }))
}));

export const useDisplayModeStore = create((set) => ({
  displayOnlyChords: false,
  setDisplayOnlyChords: () => set((state) => ({ displayOnlyChords: !state.displayOnlyChords })),
}));
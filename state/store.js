import { create } from "zustand";

export const useTranspositionNumberStore = create((set) => ({
  transpositionArray: [],
  transpositionNumber: 0,
  activeSongIndex: null,
  activeTransposition: false,
  setActiveSongIndex: (index) => set((state) => ({ activeSongIndex: index })),
  setTranspositionArray: (array) => set((state) => ({ transpositionArray: array })),
  transposeUpArray: (index) => set((state) => {
    const newArray = [...state.transpositionArray];
    newArray[index] = newArray[index] === 11 ? 0 : newArray[index] + 1;
    return { transpositionArray: newArray };
  }),
  transposeDownArray: (index) => set((state) => {
    const newArray = [...state.transpositionArray];
    newArray[index] = newArray[index] === -11 ? 0 : newArray[index] - 1;
    return { transpositionArray: newArray };
  }),
  transposeUp: () => set((state) => {
    const number = state.transpositionNumber === 11 ? 0 : state.transpositionNumber + 1;
    return { transpositionNumber: number };
  }),
  transposeDown: () => set((state) => {
    const number = state.transpositionNumber === -11 ? 0 : state.transpositionNumber - 1;
    return { transpositionNumber: number };
  }),
  setActiveTransposition: () => set((state) => ({ activeTransposition: true })),
  setInactiveTransposition: () => set((state) => ({ activeTransposition: false })),
  setTranspositionNumber: (number) => set((state) => ({ transpositionNumber: number })),
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
  setDisableTransposition: () => set((state) => ({ transposition: false })),
  setEnableTransposition: () => set((state) => ({ transposition: true })),
}));

export const useSearchStore = create((set) => ({
  songName: '',
  artistId: '',
  setArtistId: (e) => set((state) => ({ artistId: e })),
  setSongName: (e) => set((state) => ({ songName: e })),
}));

export const useSongVersionStore = create((set) => ({
  songId: '',
  versionId: '',
  setSongId: (e) => set((state) => ({ songId: e })),
  setVersionId: (e) => set((state) => ({ versionId: e })),
}));

export const useUserStore = create((set) => ({
  user: { id: '', username: '', email: '', },
  logInData: { email: '', password: '' },
  setId: (e) => set((state) => ({ user: { ...state.user, id: e } })),
  setUsername: (e) => set((state) => ({ user: { ...state.user, username: e } })),
  setEmail: (e) => set((state) => ({ user: { ...state.user, email: e } })),
  setLogInEmail: (e) => set((state) => ({ logInData: { ...state.logInData, email: e } })),
  setLogInPassword: (e) => set((state) => ({ logInData: { ...state.logInData, password: e } })),
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
  playlistNameModal: false,
  setPlaylistNameModal: () => set((state) => ({ playlistNameModal: !state.playlistNameModal })),
  setModalVisible: () => set((state) => ({ modalVisible: !state.modalVisible })),
  setModalOptions: () => set((state) => ({ modalOptions: !state.modalOptions }))
}));

export const useDisplayModeStore = create((set) => ({
  displayOnlyChords: false,
  showMetadata: true,
  showKey: true,
  showCapo: true,
  showTempo: true,
  setShowMetadata: (e) => set((state) => {
    const showMetadata = !state.showMetadata;
    console.log('showMetadata', showMetadata);
    if (!showMetadata) {
      set({showMetadata: showMetadata, showKey: false, showCapo: false, showTempo: false });
    } else {
      set({showMetadata: showMetadata, showKey: true, showCapo: true, showTempo: true });
    }
    return { showMetadata };
  }),
  setShowKey: (e) => set((state) => ({ showKey: !state.showKey })),
  setShowCapo: (e) => set((state) => ({ showCapo: !state.showCapo })),
  setShowTempo: (e) => set((state) => ({ showTempo: !state.showTempo })),
  setDisplayOnlyChords: () => set((state) => ({ displayOnlyChords: !state.displayOnlyChords })),
  setDisableOnlyChords: () => set((state) => ({ displayOnlyChords: false })),
}));

export const useAutoscrollStore = create((set) => ({
  isScrolling: false,
  autoScrollSpeed: 5,
  setAutoScrollSpeed: (e) => {
    const speed = e < 1 ? 1 : e > 10 ? 10 : e;
    set((state) => ({ autoScrollSpeed: speed }))
  },
  setIsScrolling: () => set((state) => ({ isScrolling: !state.isScrolling })),
  setEndScroll: () => set((state) => ({ isScrolling: false, autoScrollSpeed: 5 })),
}));

export const useShareStore = create((set) => ({
  share: false,
  sending: false,
  username: '',
  rerenderHelper: false,
  setRerenderHelper: () => set((state) => ({ rerenderHelper: !state.rerenderHelper })),
  setUsername: (e) => set((state) => ({ username: e })),
  setSending: () => set((state) => ({ sending: !state.sending })),
  setShare: () => set((state) => ({ share: !state.share })),
  setDisableShare: () => set((state) => ({ share: false })),
}));

export const useNetworkStore = create((set) => ({
  isConnected: false,
  setIsConnected: (e) => set((state) => ({ isConnected: e })),
}));

export const useOfflineStore = create((set) => ({
  songJSON: null,
  playlistJSON: null,
  setSongJSON: (e) => set((state) => ({ songJSON: e })),
  setPlaylistJSON: (e) => set((state) => ({ playlistJSON: e })),
}));
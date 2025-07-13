import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { styles } from '../style/styles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, usePathname } from 'expo-router';
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDisplayModeStore, useModalStore, usePlaylistStore, useShareStore, useTranspositionStore } from '../state/store';

const PlaylistsHeader = () => {

  const pathname = usePathname();

  const playlistName = usePlaylistStore((state) => state.playlistName);

  const setModalVisible = useModalStore((state) => state.setPlaylistNameModal);
  const setDisplayOnlyChords = useDisplayModeStore((state) => state.setDisplayOnlyChords);
  const setPlaylistName = usePlaylistStore((state) => state.setPlaylistName);
  const setPlaylistId = usePlaylistStore((state) => state.setPlaylistId);
  const setTransposition = useTranspositionStore((state) => state.transpose);

  const dropdownSelect = (value) => {
    if (value === 'Only chords') {
      setDisplayOnlyChords();
    };
    if (value === 'Transpose') {
      setTransposition();
    };
  }

  return (
    <View style={styles.header}>
      {(pathname === '/playlist-songs' || pathname === '/display-playlist') && (
        <Pressable
          style={styles.backButton}
          onPress={() => { 
            router.back();
            if (pathname === '/playlist-songs') {
              setPlaylistId('');
              setPlaylistName('');
            } 
          }}
        >
          <Ionicons name="chevron-back" size={28} color="black" />
        </Pressable>
      )}
      <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 8, paddingLeft: 20 }}>
      {pathname === '/playlists' && (
        <Text style={styles.headerMainTitle}>{'Your playlists'}</Text>
      ) || (
        <Text style={styles.headerMainTitle}>{playlistName}</Text>
      )}
      </View>
      {pathname === '/playlists' && (
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              setModalVisible();
            }}
          >
            <MaterialCommunityIcons name="playlist-plus" size={30} color="black" />
          </Pressable>
        </View>
      ) || pathname === '/playlist-songs' && (
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              createMutation.mutate({
                metadata: metadata,
                content: content
              });
            }}
          >
            <AntDesign name="plus" size={28} color="black" />
          </Pressable>
        </View>
      ) || (
          <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
            <ModalDropdown
              saveScrollPosition={false}
              options={['Transpose', 'Only chords', 'Share', 'Export as PDF',]}
              dropdownStyle={{ borderWidth: 1, borderColor: 'black', }}
              dropdownTextStyle={{ color: 'black', fontSize: 15 }}
              dropdownTextHighlightStyle={{ color: 'black' }}
              onSelect={(index, value) => dropdownSelect(value)}
            >
              <Ionicons name="ellipsis-vertical" size={30} color="black" />
            </ModalDropdown>
          </View>
        )}
    </View>
  )
}

export default PlaylistsHeader;
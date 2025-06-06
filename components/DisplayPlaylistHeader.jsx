import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../style/styles';
import { router } from 'expo-router';
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAutoscrollStore, useDisplayModeStore, usePlaylistStore, useShareStore, useTranspositionStore } from '../state/store';

const DisplayPlaylistHeader = () => {

  const playlistName = usePlaylistStore((state) => state.playlistName);

  const setDisplayOnlyChords = useDisplayModeStore((state) => state.setDisplayOnlyChords);
  const setDisableTransposition = useTranspositionStore((state) => state.setDisableTransposition);
  const setTransposition = useTranspositionStore((state) => state.transpose);
  const setIsScrolling = useAutoscrollStore((state) => state.setIsScrolling);
  const isScrolling = useAutoscrollStore((state) => state.isScrolling);
  const setEndScroll = useAutoscrollStore((state) => state.setEndScroll);
  const setShare = useShareStore((state) => state.setShare);

  const dropdownSelect = (value) => {
    if (value === 'Only chords') {
      setDisplayOnlyChords();
      console.log('Only chords selected');
    };
    if (value === 'Transpose') {
      setTransposition();
    };
    if (value === 'Share') {
      setShare();
    };
  }

  return (
    <View style={styles.header}>

      <Pressable
        style={styles.backButton}
        onPress={() => {
          setEndScroll();
          setDisableTransposition();
          router.back();
        }}
      >
        <Ionicons name="chevron-back" size={28} color="black" />
      </Pressable>

      <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 8, paddingLeft: 20 }}>
        <Text style={styles.headerMainTitle}>{playlistName || ''}</Text>
      </View>

      <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            setIsScrolling();
          }}
        >
          <Ionicons name={isScrolling ? "pause" : "play"} size={30} color="black" />
        </Pressable>
      </View>

      <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
        <ModalDropdown
          saveScrollPosition={false}
          options={['Transpose', 'Only chords', 'Share', 'Export as PDF',]}
          dropdownStyle={{ borderWidth: 1, borderColor: 'black', }}
          dropdownTextStyle={{ color: 'black', fontSize: 15 }}
          dropdownTextHighlightStyle={{ color: 'black' }}
          onSelect={(index, value) => dropdownSelect(value)}
        >
          <Ionicons name="ellipsis-vertical" size={28} color="black" />
        </ModalDropdown>
      </View>
    </View>
  );
}

export default DisplayPlaylistHeader;
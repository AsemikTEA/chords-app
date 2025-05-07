import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';
import { styles } from '../style/styles';
import ModalDropdown from 'react-native-modal-dropdown';
import { useAutoscrollStore, useDisplayModeStore, useModalStore, useSongContentStore, useTranspositionStore } from '../state/store';

const Header = ({ song, artist }) => {

  const pathname = usePathname();

  const setTransposition = useTranspositionStore((state) => state.transpose);
  const setDisplayOnlyChords = useDisplayModeStore((state) => state.setDisplayOnlyChords);
  const setModalVisible = useModalStore((state) => state.setModalVisible);

  const setIsScrolling = useAutoscrollStore((state) => state.setIsScrolling);
  const isScrolling = useAutoscrollStore((state) => state.isScrolling);
  const setEndScroll = useAutoscrollStore((state) => state.setEndScroll);

  const dropdownSelect = (value) => {
    if (value === 'Transpose') {
      setTransposition();
    }
    if (value === 'Edit song') {
      router.navigate('/edit');
    }
    if (value === 'Only chords') {
      setDisplayOnlyChords();
      console.log('Only chords selected');
    }
    if (value === 'Add to playlist') {
      setModalVisible();
    }
  }

  return (
    <View style={styles.header}>
      <Pressable
        style={styles.backButton}
        onPress={() => {
          setEndScroll();
          router.back()
        }}
      >
        <Ionicons name="chevron-back" size={28} color="black" />
      </Pressable>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerMainTitle}>{song}</Text>
        <Text>{artist}</Text>
      </View>

      {pathname === '/display' && (
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              setIsScrolling();
            }}
          >
            <Ionicons name={isScrolling ? "pause" : "play"} size={30} color="black" />
          </Pressable>
        </View>)}

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {pathname === '/display' && (
          <ModalDropdown
            saveScrollPosition={false}
            options={['Transpose', 'Only chords', 'Edit song', 'Add to playlist', 'Share', 'Export as PDF',]}
            dropdownStyle={{ borderWidth: 1, borderColor: 'black', }}
            dropdownTextStyle={{ color: 'black', fontSize: 15 }}
            dropdownTextHighlightStyle={{ color: 'black' }}
            onSelect={(index, value) => dropdownSelect(value)}
          >
            <Ionicons name="ellipsis-vertical" size={30} color="black" />
          </ModalDropdown>
        )}
      </View>

    </View>
  )
}

export default Header;
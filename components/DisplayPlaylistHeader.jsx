import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { styles } from '../style/styles';
import { router } from 'expo-router';
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAutoscrollStore, useDisplayModeStore, useNetworkStore, usePlaylistStore, useShareStore, useTranspositionStore } from '../state/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';

const DisplayPlaylistHeader = () => {

  const queryClient = useQueryClient();

  const dropdownRef = useRef(null);

  const playlistName = usePlaylistStore((state) => state.playlistName);
  const isConnected = useNetworkStore((state) => state.isConnected);

  const setDisplayOnlyChords = useDisplayModeStore((state) => state.setDisplayOnlyChords);
  const setDisableTransposition = useTranspositionStore((state) => state.setDisableTransposition);
  const setTransposition = useTranspositionStore((state) => state.transpose);
  const setIsScrolling = useAutoscrollStore((state) => state.setIsScrolling);
  const isScrolling = useAutoscrollStore((state) => state.isScrolling);
  const setEndScroll = useAutoscrollStore((state) => state.setEndScroll);
  const setShowMetadata = useDisplayModeStore((state) => state.setShowMetadata);
  const setShowKey = useDisplayModeStore((state) => state.setShowKey);
  const setShowCapo = useDisplayModeStore((state) => state.setShowCapo);
  const setShowTempo = useDisplayModeStore((state) => state.setShowTempo);
  const setShare = useShareStore((state) => state.setShare);

  const [selectedMultiOptions, setSelectedMultiOptions] = useState([
    'Show metadata',
    'Show key',
    'Show capo',
    'Show tempo',
  ]);

  let options;

  if (isConnected) {
    options = [
      'Only chords',
      'Show metadata',
      'Show key',
      'Show capo',
      'Show tempo',
      'Download JSON',
    ];
  } else {
    options = [
      'Only chords',
      'Show metadata',
      'Show key',
      'Show capo',
      'Show tempo',
    ];
  }

  const multiSelectKeys = ['Only chords', 'Show metadata', 'Show key', 'Show capo', 'Show tempo'];

  const dropdownSelect = (value) => {
    if (multiSelectKeys.includes(value)) {
      if (value === 'Show metadata') {
        setSelectedMultiOptions((prev) =>
          prev.includes(value || 'Show key' || 'Show capo' || 'Show tempo')
            ? prev.filter((v) => v !== value && v !== 'Show key' && v !== 'Show capo' && v !== 'Show tempo')
            : [...prev, 'Show metadata', 'Show key', 'Show capo', 'Show tempo']
        );
      } else {
        setSelectedMultiOptions((prev) =>
          prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value]
        );
      }

      switch (value) {
        case 'Only chords':
          setDisplayOnlyChords();
          break;
        case 'Show metadata':
          setShowMetadata();
          break;
        case 'Show key':
          setShowKey();
          break;
        case 'Show capo':
          setShowCapo();
          break;
        case 'Show tempo':
          setShowTempo();
          break;
        default:
          break;
      }
    } else {

      switch (value) {
        case 'Share':
          setShare();
          break;
        case 'Export as PDF':
          console.log('Export logic...');
          break;
        case 'Download JSON':
          const playlist = queryClient.getQueryData(['playlist-songs-display']);

          const jsonObject = {
            playlist_id: {
              _id: playlist._id,
              name: playlistName,
              songs: playlist.songs,
            }
          };

          const storeData = async (value) => {
            try {
              const jsonValue = JSON.stringify(value);
              await AsyncStorage.setItem(`playlist_${value.playlist_id._id}`, jsonValue);
              console.log('JSON saved successfully:', jsonValue);
            } catch (e) {
              console.error('Error saving JSON to AsyncStorage:', e);
              throw e;
            }
          };

          storeData(jsonObject);

          break;
        default:
          break;
      }
    }
  };

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
          ref={dropdownRef} // připojení referencí
          saveScrollPosition={false}
          options={options}
          dropdownStyle={{
            backgroundColor: '#fff',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#000',
            paddingVertical: 4,
            width: 180,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 5,
          }}
          dropdownTextStyle={{
            color: '#000',
            fontSize: 15,
            paddingVertical: 10,
            paddingHorizontal: 12,
          }}
          dropdownTextHighlightStyle={{
            backgroundColor: '#f0f0f0',
            color: '#000',
          }}
          adjustFrame={(style) => ({
            ...style,
            top: style.top - 5,
            right: style.right + 10,
            height: 'auto',
          })}
          multipleSelect={true}
          onSelect={(index, value) => dropdownSelect(value)}
          renderRow={(item, index, isSelected) => {
            const isMulti = multiSelectKeys.includes(item);
            const isSelectedMulti = selectedMultiOptions.includes(item);

            return (
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  backgroundColor: isMulti && isSelectedMulti ? '#e0e0e0' : '#fff',
                }}
              >
                <Text style={{ color: '#000', fontSize: 15 }}>
                  {isMulti ? `${isSelectedMulti ? '☑' : '☐'} ${item}` : item}
                </Text>
              </View>
            );
          }}
        >
          <View style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </View>
        </ModalDropdown>
      </View>
    </View>
  );
}

export default DisplayPlaylistHeader;
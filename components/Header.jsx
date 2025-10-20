import { View, Text, Pressable } from 'react-native';
import React, { useState, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';
import { styles } from '../style/styles';
import ModalDropdown from 'react-native-modal-dropdown';
import {
  useAutoscrollStore,
  useDisplayModeStore,
  useModalStore,
  useNetworkStore,
  useTranspositionStore,
} from '../state/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';

const Header = ({ song, artist }) => {

  const queryClient = useQueryClient();

  const pathname = usePathname();
  const dropdownRef = useRef(null); // ref pro manuální zavření dropdownu

  const isConnected = useNetworkStore((state) => state.isConnected);
  const setTransposition = useTranspositionStore((state) => state.transpose);
  const setDisplayOnlyChords = useDisplayModeStore((state) => state.setDisplayOnlyChords);
  const setModalVisible = useModalStore((state) => state.setModalVisible);

  const setIsScrolling = useAutoscrollStore((state) => state.setIsScrolling);
  const isScrolling = useAutoscrollStore((state) => state.isScrolling);
  const setEndScroll = useAutoscrollStore((state) => state.setEndScroll);
  const setShowMetadata = useDisplayModeStore((state) => state.setShowMetadata);
  const setShowKey = useDisplayModeStore((state) => state.setShowKey);
  const setShowCapo = useDisplayModeStore((state) => state.setShowCapo);
  const setShowTempo = useDisplayModeStore((state) => state.setShowTempo);

  const [selectedMultiOptions, setSelectedMultiOptions] = useState([
    'Show metadata',
    'Show key',
    'Show capo',
    'Show tempo',
  ]);

  let options;

  if (isConnected) {
    options = [
      'Transpose',
      'Only chords',
      'Show metadata',
      'Show key',
      'Show capo',
      'Show tempo',
      'Edit song',
      'Add to playlist',
      'Download JSON',
    ];
  } else {
    options = [
      'Transpose',
      'Only chords',
      'Show metadata',
      'Show key',
      'Show capo',
      'Show tempo',
      'Edit song',
    ];
  }

  const multiSelectKeys = ['Transpose', 'Only chords', 'Show metadata', 'Show key', 'Show capo', 'Show tempo'];

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
        case 'Transpose':
          setTransposition();
          break;
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
        case 'Edit song':
          router.navigate('/edit');
          break;
        case 'Add to playlist':
          setModalVisible();
          break;
        case 'Share':
          console.log('Share logic...');
          break;
        case 'Export as PDF':
          console.log('Export logic...');
          break;
        case 'Download JSON':
          const version = queryClient.getQueryData(['song-version']);

          const jsonObject = {
            _id: version._id,
            version: version.version,
            metadata: version.metadata,
            content: version.content,
            userTransposition: version.userTransposition || 0,
          };

          const storeData = async (value) => {
            try {
              const jsonValue = JSON.stringify(value);
              await AsyncStorage.setItem(`song_${value._id}`, jsonValue);
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
          router.back();
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
          <Pressable style={styles.backButton} onPress={() => setIsScrolling()}>
            <Ionicons name={isScrolling ? 'pause' : 'play'} size={30} color="black" />
          </Pressable>
        </View>
      )}

      <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
        {pathname === '/display' && (
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
        )}
      </View>
    </View>
  );
};

export default Header;
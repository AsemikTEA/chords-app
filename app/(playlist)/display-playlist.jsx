import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable, StyleSheet, TextInput } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { usePlaylistDisplay } from '../../hooks/usePlaylistDisplay'
import { useAutoscrollStore, useDisplayModeStore, usePlaylistStore, useShareStore, useTranspositionStore, useUserStore } from '../../state/store'
import { styles } from '../../style/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import SongViewPlaylist from '../../components/SongViewPlaylist'
import { useNavigation } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import AutoscrollSpeed from '../../components/AutoscrollSpeed'
import SharePlaylistModal from '../../components/SharePlaylistModal'
import Transpose from '../../components/Transpose'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { set } from 'react-hook-form'

const PlaylistDisplay = () => {

  const scrollRef = useRef(null);
  const scrollInterval = useRef(null);
  const currentScrollY = useRef(0);
  const scrollSpeed = useRef(useAutoscrollStore.getState().autoScrollSpeed);
  const speedPanel = useRef(null);

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const playlistId = usePlaylistStore((state) => state.playlistId);
  const user = useUserStore((state) => state.user);

  const setEndScroll = useAutoscrollStore((state) => state.setEndScroll);
  const setDisableOnlyChords = useDisplayModeStore((state) => state.setDisableOnlyChords);
  const setDisableShare = useShareStore((state) => state.setDisableShare);

  const { data, isPending, isError } = usePlaylistDisplay({
    playlistId: playlistId,
    userId: user.id
  });

  const [transpositionNumbers, setTranspositionNumbers] = useState([]);
  const activeSongIndex = useRef(null);
  const [activeSongIndex2, setActiveSongIndex] = useState(null);
  const songRefs = useRef([]);

  useEffect(() => {
    navigation.addListener('blur', () => {
      queryClient.invalidateQueries({ queryKey: ['playlist-songs-display'] });
      console.log('Uživatel opustil display-song (z `SongView`)');
      stopAutoScroll();
      setDisableOnlyChords();
      setDisableShare();

    });
  }, [navigation]);

  useEffect(() => {
  if (data?.songs && transpositionNumbers.length < data.songs.length) {
    const initial = data.songs.map((item) => item.transposition || 0);
    setTranspositionNumbers(initial);
  }
}, [data]);

  useEffect(() => {
    const unsub = useAutoscrollStore.subscribe((state) => {
      if (state.isScrolling) {
        showPanel();
        startAutoScroll();
      }
      else {
        stopAutoScroll();
        hidePanel();
      }
    });

    return unsub;
  }, []);

  useEffect(() => {
    const unsub = useAutoscrollStore.subscribe((newSpeed, oldSpeed) => {
      console.log('Auto scroll speed changed from', oldSpeed.autoScrollSpeed, 'to', newSpeed.autoScrollSpeed);
      scrollSpeed.current = newSpeed.autoScrollSpeed;

      if (scrollInterval.current) {
        stopAutoScroll();
        startAutoScroll();
      }
    });

    return unsub;
  }, []);

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    currentScrollY.current = y;

    const contentHeight = event.nativeEvent.contentSize.height;
    const viewportHeight = event.nativeEvent.layoutMeasurement.height;

    if (y + viewportHeight >= contentHeight - 5) {
      stopAutoScroll();
      setEndScroll();
    }
  }

  const startAutoScroll = useCallback(() => {
    if (!scrollRef.current || scrollInterval.current) return;

    if (!scrollRef.currentContentY) {
      scrollRef.currentContentY = 0;
    }

    stopAutoScroll();

    scrollInterval.current = setInterval(() => {
      scrollRef.current.scrollTo({
        y: currentScrollY.current + 1,
        animated: false,
      });
      currentScrollY.current += 1;
    }, getDelayFromSpeed(scrollSpeed.current));
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  }, []);

  const getDelayFromSpeed = (speed) => {
    const maxSpeed = 10;
    const minDelay = 10;
    const maxDelay = 200;

    const fraction = (maxSpeed - speed) / (maxSpeed - 1);
    return Math.round(minDelay + fraction * (maxDelay - minDelay));
  };

  const showPanel = () => {
    speedPanel.current?.setNativeProps({
      style: { display: 'flex' }
    });
  };

  const hidePanel = () => {
    speedPanel.current?.setNativeProps({
      style: { display: 'none' }
    });
  };

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error fetching playlist songs. Please try again.</Text>;
  }

  if (!data || !data.songs || data.songs.length === 0) {
    return <Text>No songs available in this playlist.</Text>;
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {data.songs.map((item, index) => {

          console.log('Transposition numbers:', transpositionNumbers ||[]);
          return (
            <View style={{ paddingLeft: 10 }} key={index}>
              <TouchableOpacity
                onLongPress={() => {
                  setActiveSongIndex(index);
                  activeSongIndex.current = index;
                }}
                key={"touchable" + index}
              >
                <SongViewPlaylist
                  ref={(el) => songRefs.current[index] = el}
                  song={item.version}
                  transposition={transpositionNumbers[index] || 0}
                />
              </TouchableOpacity>
            </View>
          )
        })}
      </ScrollView>
      <View
        ref={speedPanel}
        style={{
          display: 'none',
        }}
      >
        <AutoscrollSpeed />
      </View>
      {
        activeSongIndex2 !== null &&
        (<View style={{ height: 80, borderTopLeftRadius: 25, borderTopRightRadius: 25, backgroundColor: '#24232B' }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
              <Pressable
                style={{ flexDirection: 'row' }}
                onPress={() => {
                  setTranspositionNumbers(prev => {
                    const newArr = [...prev];
                    newArr[activeSongIndex.current] += 1;
                    return newArr;
                  });
                  console.log('Transposition number increased:', transpositionNumbers)
                }}
              >
                <FontAwesome6 name="arrow-up-long" size={34} color="#f2f2f2" />
                <MaterialCommunityIcons name="music-accidental-sharp" size={30} color="#f2f2f2" />
              </Pressable>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
              <Text style={{ fontSize: 25, color: '#f2f2f2' }}>{transpositionNumbers[activeSongIndex2]}</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
              <Pressable
                style={{ flexDirection: 'row' }}
                onPress={() => {
                  setTranspositionNumbers(prev => {
                    const newArr = [...prev];
                    newArr[activeSongIndex.current] -= 1;
                    return newArr;
                  });
                  console.log('Transposition number decreased:', transpositionNumbers)
                }}
              >
                <FontAwesome6 name="arrow-down-long" size={34} color="#f2f2f2" />
                <MaterialCommunityIcons name="music-accidental-flat" size={30} color="#f2f2f2" />
              </Pressable>
            </View>
          </View>
        </View>)
      }
      <SharePlaylistModal userId={user.id} playlistId={playlistId} />
    </SafeAreaView>
  );
}

export default PlaylistDisplay;
import { View, Text, ScrollView, TouchableOpacity,} from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { usePlaylistDisplay } from '../../hooks/usePlaylistDisplay'
import { useAutoscrollStore, useDisplayModeStore, useNetworkStore, useOfflineStore, usePlaylistStore, useShareStore, useSongContentStore, useTranspositionNumberStore, useTranspositionStore, useUserStore } from '../../state/store'
import SongViewPlaylist from '../../components/SongViewPlaylist'
import { useFocusEffect, useNavigation } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import AutoscrollSpeed from '../../components/AutoscrollSpeed'
import SharePlaylistModal from '../../components/SharePlaylistModal'
import TranspositionTab from '../../components/TranspositionTab'
import { useSaveTransposition } from '../../hooks/useSaveTransposition'
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlaylistDisplay = () => {

  const scrollRef = useRef(null);
  const scrollInterval = useRef(null);
  const currentScrollY = useRef(0);
  const scrollSpeed = useRef(useAutoscrollStore.getState().autoScrollSpeed);
  const speedPanel = useRef(null);
  const transpositionTab = useRef(null);

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const isConnected = useNetworkStore((state) => state.isConnected);
  const playlistJSON = useOfflineStore((state) => state.playlistJSON);
  const playlistId = usePlaylistStore((state) => state.playlistId);
  const user = useUserStore((state) => state.user);
  const songMeta = useSongContentStore((state) => state.songMetaData);

  const setEndScroll = useAutoscrollStore((state) => state.setEndScroll);
  const setDisableOnlyChords = useDisplayModeStore((state) => state.setDisableOnlyChords);
  const setDisableShare = useShareStore((state) => state.setDisableShare);
  const setTranspositionArray = useTranspositionNumberStore((state) => state.setTranspositionArray);
  const setActiveSongIndex = useTranspositionNumberStore((state) => state.setActiveSongIndex);
  const setActiveTransposition = useTranspositionNumberStore((state) => state.setActiveTransposition);
  const setInactiveTransposition = useTranspositionNumberStore((state) => state.setInactiveTransposition);
  const setTitle = useSongContentStore((state) => state.setTitle);

  let playlistSongs

  if (isConnected) {
    playlistSongs = usePlaylistDisplay({
      playlistId: playlistId,
      userId: user.id
    });
  } else {
    playlistSongs = {
      data: playlistJSON.playlist_id
    }
  }
  const saveTransposition = useSaveTransposition();

  useEffect(() => {
    if (!playlistSongs.data || !playlistSongs.data.songs || playlistSongs.data.songs.length === 0) {
      return;
    }

    const onBlur = () => {
      const transpositionArray = useTranspositionNumberStore.getState().transpositionArray;

      if (isConnected) {
        playlistSongs.data.songs.forEach((song, i) => {
          const versionId = song.version._id;
          const transpositionNumber = transpositionArray[i] || 0;

          const transData = {
            versionId,
            userId: useUserStore.getState().user.id,
            transposition: transpositionNumber,
          };

          saveTransposition.mutate(transData);
        });
      } else {
        playlistSongs.data.songs.forEach((song, i) => {
          const transpositionNumber = transpositionArray[i] || 0;

          song.userTransposition = transpositionNumber;
        });

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

        storeData({playlist_id: playlistSongs.data});
      }

      queryClient.invalidateQueries({ queryKey: ['playlist-songs-display'] });
      stopAutoScroll();
      setDisableOnlyChords();
      setInactiveTransposition();
      setDisableShare();
      hideTranspositionTab();
      hidePanel();
    };

    const unsubscribe = navigation.addListener('blur', onBlur);

    return () => {
      unsubscribe;
    }
  }, [playlistSongs.data, navigation]);

  useEffect(() => {
    if (!playlistSongs.data || !playlistSongs.data.songs || playlistSongs.data.songs.length === 0) {
      return;
    }

    const initial = playlistSongs.data.songs.map((item) => item.userTransposition || 0);
    setTranspositionArray(initial);
  }, [playlistSongs.data]);

  useEffect(() => {
    const unsub = useAutoscrollStore.subscribe((state) => {
      if (state.isScrolling) {
        hideTranspositionTab();
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
    const unsub = useTranspositionNumberStore.subscribe((state) => {
      if (state.activeTransposition) {
        setEndScroll();
        stopAutoScroll();
        hidePanel();
        showTranspositionTab();
      }
      else {
        hideTranspositionTab();
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

  const showTranspositionTab = () => {
    transpositionTab.current?.setNativeProps({
      style: { display: 'flex' }
    });
  };

  const hideTranspositionTab = () => {
    transpositionTab.current?.setNativeProps({
      style: { display: 'none' }
    });
  };

  if (playlistSongs.isPending) {
    return <Text>Loading...</Text>;
  }

  if (playlistSongs.isError) {
    return <Text>Error fetching playlist songs. Please try again.</Text>;
  }

  if (!playlistSongs.data || !playlistSongs.data.songs || playlistSongs.data.songs.length === 0) {
    return <Text>No songs available in this playlist.</Text>;
  }

  return (
    <>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {playlistSongs.data.songs.map((item, index) => {
          return (
            <View style={{ paddingLeft: 10 }} key={index}>
              <TouchableOpacity
                onLongPress={() => {
                  setTitle(item.version.metadata.title);
                  setActiveSongIndex(index);
                  setActiveTransposition();
                }}
                key={"touchable" + index}
              >
                <SongViewPlaylist
                  song={item.version}
                  index={index}
                />
              </TouchableOpacity>
            </View>
          )
        })}
        <View
          ref={transpositionTab}
          style={{
            display: 'none',
            marginBottom: 20,
          }}
        />
      </ScrollView>
      <View
        ref={speedPanel}
        style={{
          display: 'none',
        }}
      >
        <AutoscrollSpeed />
      </View>
      <View
        ref={transpositionTab}
        style={{
          display: 'none',
        }}
      >
        <TranspositionTab title={songMeta.title} />
      </View>
      <SharePlaylistModal userId={user.id} playlistId={playlistId} />
    </>
  );
}

export default PlaylistDisplay;
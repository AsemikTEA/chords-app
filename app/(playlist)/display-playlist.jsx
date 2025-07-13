import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable, StyleSheet, TextInput } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { usePlaylistDisplay } from '../../hooks/usePlaylistDisplay'
import { useAutoscrollStore, useDisplayModeStore, usePlaylistStore, useShareStore, useSongContentStore, useTranspositionNumberStore, useTranspositionStore, useUserStore } from '../../state/store'
import { styles } from '../../style/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import SongViewPlaylist from '../../components/SongViewPlaylist'
import { useFocusEffect, useNavigation } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import AutoscrollSpeed from '../../components/AutoscrollSpeed'
import SharePlaylistModal from '../../components/SharePlaylistModal'
import TranspositionTab from '../../components/TranspositionTab'
import { useSaveTransposition } from '../../hooks/useSaveTransposition'

const PlaylistDisplay = () => {

  const scrollRef = useRef(null);
  const scrollInterval = useRef(null);
  const currentScrollY = useRef(0);
  const scrollSpeed = useRef(useAutoscrollStore.getState().autoScrollSpeed);
  const speedPanel = useRef(null);
  const transpositionTab = useRef(null);

  const navigation = useNavigation();
  const queryClient = useQueryClient();

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

  const { data, isPending, isError } = usePlaylistDisplay({
    playlistId: playlistId,
    userId: user.id
  });
  const saveTransposition = useSaveTransposition();

  // useFocusEffect(
  //   useCallback(() => {
  //     const queryData = data;

  //     return () => {
  //       queryClient.invalidateQueries({ queryKey: ['playlist-songs-display'] });
  //       stopAutoScroll();
  //       setDisableOnlyChords();
  //       setDisableShare();
  //       hideTranspositionTab();
  //       hidePanel();

  //       // const transNumber = useTranspositionNumberStore.getState().transpositionNumber;
  //       // const userTransposition = version.data?.userTransposition ?? 0;

  //       // console.log('Transposition number on blur:', transNumber);
  //       // console.log('User transposition from version:', userTransposition);

  //       const transpositionArray = useTranspositionNumberStore.getState().transpositionArray;

  //       for (let i = 0; i < queryData.songs.length; i++) {
  //         const versionId = song.version._id;
  //         const transpositionNumber = transpositionArray[song.i] || 0;

  //         const transData = {
  //           versionId: versionId,
  //           userId: useUserStore.getState().user.id,
  //           transposition: transpositionNumber,
  //         };
  //         saveTransposition.mutate(transData);
  //       }
  //     };
  //   }, [])
  // );

  useEffect(() => {
    if (!data || !data.songs || data.songs.length === 0) {
      return;
    }
    
    const onBlur = () => {
      const transpositionArray = useTranspositionNumberStore.getState().transpositionArray;

      data.songs.forEach((song, i) => {
        const versionId = song.version._id;
        const transpositionNumber = transpositionArray[i] || 0;

        const transData = {
          versionId,
          userId: useUserStore.getState().user.id,
          transposition: transpositionNumber,
        };

        saveTransposition.mutate(transData);
      });

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
  }, [data, navigation]);

  useEffect(() => {
    if (!data || !data.songs || data.songs.length === 0) {
      return;
    }

    const initial = data.songs.map((item) => item.userTransposition || 0);
    setTranspositionArray(initial);
  }, [data]);

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
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {data.songs.map((item, index) => {
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
    </SafeAreaView>
  );
}

export default PlaylistDisplay;
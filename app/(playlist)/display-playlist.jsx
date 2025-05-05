import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { usePlaylistDisplay } from '../../hooks/usePlaylistDisplay'
import { useAutoscrollStore, useDisplayModeStore, usePlaylistStore, useTranspositionStore, useUserStore } from '../../state/store'
import { styles } from '../../style/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import SongViewPlaylist from '../../components/SongViewPlaylist'
import { useNavigation } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import AutoscrollSpeed from '../../components/AutoscrollSpeed'

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

  const { data, isPending, isError } = usePlaylistDisplay({
    playlistId: playlistId,
    userId: user.id
  });

  useEffect(() => {
    navigation.addListener('blur', () => {
      queryClient.invalidateQueries({ queryKey: ['playlist-songs-display'] });
      console.log('Uživatel opustil display-song (z `SongView`)');
      stopAutoScroll();
      setDisableOnlyChords();
    });
  }, [navigation]);

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
          return (
            <View style={{ paddingLeft: 10 }} key={index}>
              <TouchableOpacity>
                <SongViewPlaylist
                  song={item.version}
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
    </SafeAreaView>
  );
}

export default PlaylistDisplay;
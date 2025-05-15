import { View, Text, ScrollView, } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import SongView from '../../components/SongView';
import Transpose from '../../components/Transpose';
import { useAutoscrollStore, useDisplayModeStore, useSongVersionStore, useTranspositionStore, } from '../../state/store';
import { useSongVersion } from '../../hooks/useSongVersion';
import AddToPlaylistModal from '../../components/AddToPlaylistModal';
import { useNavigation } from 'expo-router';
import Header from '../../components/Header';
import AutoscrollSpeed from '../../components/AutoscrollSpeed';
import { showMessage } from 'react-native-flash-message';

const DisplaySong = () => {

  const scrollRef = useRef(null);
  const scrollInterval = useRef(null);
  const currentScrollY = useRef(0);
  const scrollSpeed = useRef(useAutoscrollStore.getState().autoScrollSpeed);
  const speedPanel = useRef(null);

  const navigation = useNavigation();

  const versionId = useSongVersionStore((state) => state.versionId);
  const transposition = useTranspositionStore((state) => state.transposition);

  const setEndScroll = useAutoscrollStore((state) => state.setEndScroll);
  const setDisableOnlyChords = useDisplayModeStore((state) => state.setDisableOnlyChords);

  const version = useSongVersion(versionId);

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header
        song={version.data?.metadata?.title ?? ''}
        artist={version.data?.metadata?.artist ?? ''}
      />
    });
  }, [version.data, navigation]);

  useEffect(() => {
      navigation.addListener('blur', () => {
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

  if (version.isPending) {
    return <Text>Loading...</Text>;
  }

  if (version.isError) {
    showMessage({
      message: 'Error loading song version',
      description: version.error.message,
      type: 'danger',
    });
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View>
          <Text>Error: {version.error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <AddToPlaylistModal version={{ version: versionId, versionModel: version.data.model }} />
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {version.isFetching && (
          <View>
            <Text>Loading...</Text>
          </View>
        ) || (
            <View style={{ margin: 15 }}>
              <SongView songContent={version.data.content} />
            </View>
          )}
      </ScrollView>
      {
        transposition &&
        <Transpose />
      }
      <View
        ref={speedPanel}
        style={{
          display: 'none',
        }}
      >
        <AutoscrollSpeed />
      </View>
    </SafeAreaView >
  );
}

export default DisplaySong;
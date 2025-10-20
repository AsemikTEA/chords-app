import { View, Text, ScrollView, } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import SongView from '../../components/SongView';
import Transpose from '../../components/Transpose';
import { useAutoscrollStore, useDisplayModeStore, useNetworkStore, useOfflineStore, useSongVersionStore, useTranspositionNumberStore, useTranspositionStore, useUserStore } from '../../state/store';
import { useSongVersion } from '../../hooks/useSongVersion';
import AddToPlaylistModal from '../../components/AddToPlaylistModal';
import { useFocusEffect, useNavigation } from 'expo-router';
import Header from '../../components/Header';
import AutoscrollSpeed from '../../components/AutoscrollSpeed';
import { showMessage } from 'react-native-flash-message';
import { useSaveTransposition } from '../../hooks/useSaveTransposition';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DisplaySong = () => {

  const scrollRef = useRef(null);
  const scrollInterval = useRef(null);
  const currentScrollY = useRef(0);
  const scrollSpeed = useRef(useAutoscrollStore.getState().autoScrollSpeed);
  const speedPanel = useRef(null);

  const navigation = useNavigation();

  const songJSON = useOfflineStore((state) => state.songJSON);
  const isConnected = useNetworkStore((state) => state.isConnected);
  const versionId = useSongVersionStore((state) => state.versionId);
  const transposition = useTranspositionStore((state) => state.transposition);
  const showMetadata = useDisplayModeStore((state) => state.showMetadata);
  const showKey = useDisplayModeStore((state) => state.showKey);
  const showCapo = useDisplayModeStore((state) => state.showCapo);
  const showTempo = useDisplayModeStore((state) => state.showTempo);

  const setEndScroll = useAutoscrollStore((state) => state.setEndScroll);
  const setDisableOnlyChords = useDisplayModeStore((state) => state.setDisableOnlyChords);
  const setDisableTransposition = useTranspositionStore((state) => state.setDisableTransposition);
  const setTranspositionNumber = useTranspositionNumberStore((state) => state.setTranspositionNumber);

  let version;

  if (isConnected) {
    const searchData = {
      versionId: versionId,
      userId: useUserStore.getState().user.id,
    }
    version = useSongVersion(searchData);
  } else {
    version = { data: songJSON };
    console.log(version);
  }

  const saveTransposition = useSaveTransposition();

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header
        song={version.data?.metadata?.title ?? ''}
        artist={version.data?.metadata?.artist ?? ''}
      />
    });
  }, [version.data, navigation]);

  useFocusEffect(
    useCallback(() => {

      return () => {
        console.log('Uživatel opustil display-song (z `SongView`)');
        stopAutoScroll();
        setDisableOnlyChords();
        setDisableTransposition();

        if (isConnected) {
          const transData = {
            versionId: versionId,
            userId: useUserStore.getState().user.id,
            transposition: useTranspositionNumberStore.getState().transpositionNumber,
          };
          saveTransposition.mutate(transData);
        } else {
          version.data.userTransposition = useTranspositionNumberStore.getState().transpositionNumber

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

          storeData(version.data);
        }

        setTranspositionNumber(0);
      };
    }, [])
  );

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
      description: version.error.response.data.message,
      type: 'danger',
    });
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View>
          <Text>Error: {version.error.response.data.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if ((version.isSuccess || !isConnected) && version.data.userTransposition) {
    setTranspositionNumber(version.data.userTransposition);
  }

  return (
    <>
      {/* <SongWebView html={html} /> */}
      {isConnected &&
        <AddToPlaylistModal version={{ version: versionId, versionModel: version.data.model }} />
      }
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {version.isFetching && (
          <View>
            <Text>Loading...</Text>
          </View>
        ) || (
            <View style={{ flex: 1 }}>
              {showMetadata && (
                <View style={{ paddingLeft: 15, }}>
                  {showKey && <Text style={{ fontSize: 16 }}>Key: {version.data.metadata.key}</Text>}
                  {showCapo && <Text style={{ fontSize: 16 }}>Capo: {version.data.metadata.capo}</Text>}
                  {showTempo && <Text style={{ fontSize: 16 }}>Tempo: {version.data.metadata.tempo}</Text>}
                </View>
              )}
              <View style={{ margin: 15, marginTop: 0 }}>
                <SongView songContent={version.data.content} />
              </View>
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
    </>
  );
}

export default DisplaySong;
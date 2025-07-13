import { View, Text, ScrollView, } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import SongView from '../../components/SongView';
import Transpose from '../../components/Transpose';
import { useAutoscrollStore, useDisplayModeStore, useSongVersionStore, useTranspositionNumberStore, useTranspositionStore, useUserStore } from '../../state/store';
import { useSongVersion } from '../../hooks/useSongVersion';
import AddToPlaylistModal from '../../components/AddToPlaylistModal';
import { useFocusEffect, useNavigation } from 'expo-router';
import Header from '../../components/Header';
import AutoscrollSpeed from '../../components/AutoscrollSpeed';
import { showMessage } from 'react-native-flash-message';
import { ChordProParser, HtmlDivFormatter, HtmlFormatter, HtmlTableFormatter } from 'chordsheetjs';
import parse from 'html-react-parser';
import WebView from 'react-native-webview';
import { set } from 'react-hook-form';
import { useSaveTransposition } from '../../hooks/useSaveTransposition';
import { QueryClient } from '@tanstack/react-query';

const DisplaySong = () => {

  //   const SongWebView = ({ html }) => {

  //     const baseHtml = `
  //       <!DOCTYPE html>
  //       <html>
  //         <head>
  //           <meta charset="UTF-8">
  //           <style>
  //   body {
  //     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen;
  //     font-size: 100px;
  //     padding: 16px;
  //     background-color: #ffffff;
  //     color: #000000;
  //   }

  //   .chord-sheet {
  //     display: flex;
  //     flex-direction: column;
  //     gap: 24px;
  //   }

  //   .paragraph {
  //     display: flex;
  //     flex-direction: column;
  //     gap: 4px;
  //   }

  //   .row {
  //     display: flex;
  //     flex-direction: column;
  //   }

  //   .row table {
  //     border-collapse: collapse;
  //     width: 100%;
  //   }

  //   .row tr {
  //     display: flex;
  //   }

  //   .row td {
  //     padding: 0 4px;
  //     white-space: pre;
  //     font-family: monospace;
  //     font-size: 16px;
  //     border: none;
  //   }

  //   .row td.chord {
  //     font-weight: bold;
  //     color: #003399;
  //     text-align: center;
  //     height: 20px;
  //   }

  //   .row td.lyrics {
  //     text-align: center;
  //   }

  //   /* Volitelně: Odstranění tabulkového vzhledu */
  //   table {
  //     display: block;
  //   }

  //   tr {
  //     display: flex;
  //     flex-direction: row;
  //     justify-content: flex-start;
  //   }

  //   td {
  //     display: inline-block;
  //     min-width: 20px;
  //   }
  // </style>
  //         </head>
  //         <body>
  //           ${html}
  //         </body>
  //       </html>
  //     `;

  //     return (
  //       <View style={{ flex: 1 }}>
  //         <WebView
  //           originWhitelist={['*']}
  //           source={{ html: baseHtml }}
  //           style={{ flex: 1 }}
  //         />
  //       </View>
  //     );
  //   };

  const scrollRef = useRef(null);
  const scrollInterval = useRef(null);
  const currentScrollY = useRef(0);
  const scrollSpeed = useRef(useAutoscrollStore.getState().autoScrollSpeed);
  const speedPanel = useRef(null);

  const navigation = useNavigation();

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

  const searchData = {
    versionId: versionId,
    userId: useUserStore.getState().user.id,
  }
  const version = useSongVersion(searchData);
  const saveTransposition = useSaveTransposition();

  // const parser = new ChordProParser();
  // const formatter = new HtmlTableFormatter({});
  // const song = parser.parse(version.data?.content || '');
  // const html = formatter.format(song);

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
      //queryClient.invalidateQueries({ queryKey: ['song-version', versionId, useUserStore.getState().user.id] });

      return () => {
        console.log('Uživatel opustil display-song (z `SongView`)');
        stopAutoScroll();
        setDisableOnlyChords();
        setDisableTransposition();

        // const transNumber = useTranspositionNumberStore.getState().transpositionNumber;
        // const userTransposition = version.data?.userTransposition ?? 0;

        // console.log('Transposition number on blur:', transNumber);
        // console.log('User transposition from version:', userTransposition);

        const transData = {
          versionId: versionId,
          userId: useUserStore.getState().user.id,
          transposition: useTranspositionNumberStore.getState().transpositionNumber,
        };
        saveTransposition.mutate(transData);

        setTranspositionNumber(0);
      };
    }, [])
  );

  // useEffect(() => {
  //   const unsubscribe = () => navigation.addListener('blur', () => {
  //     console.log('Uživatel opustil display-song (z `SongView`)');
  //     stopAutoScroll();
  //     setDisableOnlyChords();
  //     setDisableTransposition();

  //     const transNumber = useTranspositionNumberStore.getState().transpositionNumber;
  //     const userTransposition = version.data?.userTransposition ?? 0;
  //     console.log('Transposition number on blur:', transNumber);
  //     console.log('User transposition from version:', version.data?.userTransposition);

  //     if (transNumber !== userTransposition) {
  //       const transData = {
  //         versionId: versionId,
  //         userId: useUserStore.getState().user.id,
  //         transposition: useTranspositionNumberStore.getState().transpositionNumber
  //       }

  //       saveTransposition.mutate(transData);
  //     }
  //     setTranspositionNumber(0);
  //   });

  //   return unsubscribe;
  // }, [navigation]);

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

  if (version.isSuccess && version.data.userTransposition) {
    setTranspositionNumber(version.data.userTransposition);
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      {/* <SongWebView html={html} /> */}
      <AddToPlaylistModal version={{ version: versionId, versionModel: version.data.model }} />
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
    </SafeAreaView >
  );
}

export default DisplaySong;
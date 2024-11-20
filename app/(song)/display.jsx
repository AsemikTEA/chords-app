import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import SongView from '../../components/SongView';
import Transpose from '../../components/Transpose';
import { useSongVersionStore, useTranspositionStore } from '../../state/store';
import { useSongVersion } from '../../hooks/useSongVersion';

const DisplaySong = () => {

  const versionId = useSongVersionStore((state) => state.versionId);
  const transposition = useTranspositionStore((state) => state.transposition);

  const version = useSongVersion(versionId);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView>
        {version.isFetching && (
          <View>
            <Text>Loading...</Text>
          </View>
        ) || (
            <View style={styles2.container}>
              <SongView songContent={version.data.content} />
            </View>
          )}
      </ScrollView>
      {transposition &&
        <Transpose />
      }
    </SafeAreaView>
  );
}

export default DisplaySong;

const styles2 = StyleSheet.create({
  container: {
    padding: 10,
  },
  lyricLine: {
    flexDirection: 'row',     // Horizontal line for lyrics and chords
    flexWrap: 'wrap',
    padding: 3
  },
  relativeContainer: {
    position: 'relative',
    marginTop: 20
  },
  chord: {
    position: 'absolute',     // Position the chord above the lyrics
    top: -20,                 // Adjust this to control how far above the lyrics the chord should be
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lyrics: {
    fontSize: 16,
  },
});
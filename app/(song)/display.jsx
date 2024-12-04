import { View, Text, ScrollView, } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import SongView from '../../components/SongView';
import Transpose from '../../components/Transpose';
import { useSongVersionStore, useTranspositionStore, } from '../../state/store';
import { useSongVersion } from '../../hooks/useSongVersion';
import AddToPlaylistModal from '../../components/AddToPlaylistModal';

const DisplaySong = () => {

  const versionId = useSongVersionStore((state) => state.versionId);
  const transposition = useTranspositionStore((state) => state.transposition);

  const version = useSongVersion(versionId);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <AddToPlaylistModal version={versionId}/>
      <ScrollView>
        {version.isFetching && (
          <View>
            <Text>Loading...</Text>
          </View>
        ) || (
            <View style={{ padding: 10 }}>
              <SongView songContent={version.data.content} />
            </View>
          )}
      </ScrollView>
      {
        transposition &&
        <Transpose />
      }
    </SafeAreaView >
  );
}

export default DisplaySong;
import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { usePlaylistDisplay } from '../../hooks/usePlaylistDisplay'
import { usePlaylistStore, useTranspositionStore } from '../../state/store'
import { styles } from '../../style/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import Transpose from '../../components/Transpose'
import SongView from '../../components/SongView'
import SongViewPlaylist from '../../components/SongViewPlaylist'

const PlaylistDisplay = () => {

  const playlistId = usePlaylistStore((state) => state.playlistId);
  const transposition = useTranspositionStore((state) => state.transposition);

  const { data, isPending, isError } = usePlaylistDisplay(playlistId);

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
      <ScrollView>
        {data.songs.map((item) => {
          return (
            <View style={{ paddingLeft: 10 }}>
              <SongViewPlaylist 
                songContent={item.content} 
                songName={item.metadata.title}
              />
            </View>
          )
        })
        }
      </ScrollView>
      {transposition &&
        <Transpose />
      }
    </SafeAreaView>
  );
}

export default PlaylistDisplay;
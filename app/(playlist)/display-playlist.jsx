import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { usePlaylistDisplay } from '../../hooks/usePlaylistDisplay'
import { usePlaylistStore, useTranspositionStore, useUserStore } from '../../state/store'
import { styles } from '../../style/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import Transpose from '../../components/Transpose'
import SongViewPlaylist from '../../components/SongViewPlaylist'
import { useNavigation } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'

const PlaylistDisplay = () => {

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const playlistId = usePlaylistStore((state) => state.playlistId);
  const user = useUserStore((state) => state.user);
  const transposition = useTranspositionStore((state) => state.transposition);

  const { data, isPending, isError } = usePlaylistDisplay({
    playlistId: playlistId,
    userId: user.id
  });

  useEffect(() => {
    navigation.addListener('blur', () => {
      queryClient.invalidateQueries({ queryKey: ['playlist-songs-display'] });
      console.log('Uživatel opustil display-song (z `SongView`)');
    });
  }, [navigation]);

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
        {data.songs.map((item, index) => {
          return (
            <View style={{ paddingLeft: 10 }}>
              <TouchableOpacity>
                <SongViewPlaylist
                  key={index}
                  song={item.version}
                />
              </TouchableOpacity>
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
import { View, Text } from 'react-native'
import React from 'react'
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import { router } from 'expo-router';
import { usePlaylistStore } from '../../state/store';
import { usePlaylistSongs } from '../../hooks/usePlaylistSongs';
import PlaylistSongListItem from '../../components/PlaylistSongListItem';
import TabPlaylistPlayButton from '../../components/TabPlayButton';

const SongVersions = () => {

  const playlistId = usePlaylistStore((state) => state.playlistId);

  const setPlaylistSong = usePlaylistStore((state) => state.setPlaylistSong);

  const { data, isLoading, isError } = usePlaylistSongs(playlistId);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error fetching playlist songs. Please try again.</Text>;
  }

  if (!data || !data.songs || data.songs.length === 0) {
    return <Text>No songs available in this playlist.</Text>;
  }

  const separator = () => {
    return <View style={styles.separator} />;
  };

  const playlistSongListItem = ({ item }) => {
    return (
      <PlaylistSongListItem
        item={item}
        handlePress={() => {
          for(song of data.songs) {
            setPlaylistSong(song._id)
          }
          router.navigate('/display-playlist');
        }}
      />)
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <FlashList
        data={data.songs}
        renderItem={playlistSongListItem}
        estimatedItemSize={20}
        ItemSeparatorComponent={separator}
      />
      <TabPlaylistPlayButton/>
    </SafeAreaView>
  );
}

export default SongVersions
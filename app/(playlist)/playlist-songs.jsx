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
import { usePlaylistSongDelete } from '../../hooks/usePlaylistSongDelete';
import { useQueryClient } from '@tanstack/react-query';

const SongVersions = () => {

  const queryClient = useQueryClient();

  const playlistId = usePlaylistStore((state) => state.playlistId);

  const setPlaylistSong = usePlaylistStore((state) => state.setPlaylistSong);

  const playlistSongs = usePlaylistSongs(playlistId);
  const deletePlaylistSong = usePlaylistSongDelete();

  if (playlistSongs.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (playlistSongs.isError) {
    return <Text>Error fetching playlist songs. Please try again.</Text>;
  }

  if (!playlistSongs.data || !playlistSongs.data.songs || playlistSongs.data.songs.length === 0) {
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
          for (song of playlistSongs.data.songs) {
            setPlaylistSong(song._id)
          };
          router.navigate('/display-playlist');
        }}
        handleDeletePress={() => {
          console.log('asd')
          deletePlaylistSong.mutate(
            {
              song: item,
              playlist: playlistSongs.data,
            },
            {
              onSuccess: () => {
                playlistSongs.refetch();
                queryClient.invalidateQueries(['playlists']);
              }
            }
          );
        }}
      />)
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <FlashList
        data={playlistSongs.data.songs}
        renderItem={playlistSongListItem}
        estimatedItemSize={20}
        ItemSeparatorComponent={separator}
      />
      <TabPlaylistPlayButton />
    </SafeAreaView>
  );
}

export default SongVersions
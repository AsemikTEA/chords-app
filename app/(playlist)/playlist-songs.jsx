import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { FlashList } from '@shopify/flash-list';
import { styles } from '../../style/styles';
import { router, useFocusEffect } from 'expo-router';
import { useNetworkStore, useOfflineStore, usePlaylistStore, useUserStore } from '../../state/store';
import { usePlaylistSongs } from '../../hooks/usePlaylistSongs';
import PlaylistSongListItem from '../../components/PlaylistSongListItem';
import TabPlaylistPlayButton from '../../components/TabPlayButton';
import { usePlaylistSongDelete } from '../../hooks/usePlaylistSongDelete';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

const PlaylistSongs = () => {

 const [rerenderHelper, setRerenderHelper] = useState(true);

  const queryClient = useQueryClient();

  const isConnected = useNetworkStore((state) => state.isConnected);
  const playlistJSON = useOfflineStore((state) => state.playlistJSON);
  const playlistId = usePlaylistStore((state) => state.playlistId);
  const user = useUserStore((state) => state.user);

  const setPlaylistJSON = useOfflineStore((state) => state.setPlaylistJSON);
  const setPlaylistSong = usePlaylistStore((state) => state.setPlaylistSong);

  let playlistSongs;

  if (isConnected) {
    const playlistSongsData = usePlaylistSongs({
      playlistId: playlistId,
      userId: user.id
    });
    playlistSongs = playlistSongsData;
  } else {
    playlistSongs = {
      data: playlistJSON.playlist_id
    };
  };

  const deletePlaylistSong = usePlaylistSongDelete();

  useFocusEffect(
    useCallback(() => {
      if (!isConnected) {
        const getStoredPlaylist = async () => {
          try {
            const key = `playlist_${playlistJSON.playlist_id._id}`;
            const jsonValue = await AsyncStorage.getItem(key);

            if (jsonValue) {
              console.log('PLAYLIST SONGS ', jsonValue);
              const playlistFromAsync = JSON.parse(jsonValue);
              playlistSongs = {
                data: playlistFromAsync.playlist_id
              };
              setRerenderHelper(prev => !prev);
              console.log(rerenderHelper);
            } else {
              playlistSongs = [];
            }
          } catch (error) {
            console.error('Error retrieving stored playlist:', error);
            showMessage({
              message: 'Error retrieving stored playlist',
              description: error.message,
              type: 'danger',
            });
            playlistSongs = [];
          }
        };

        getStoredPlaylist();
      }
    }, [isConnected])
  );

  if (playlistSongs.isLoading) {
    return <Text>Loading...</Text>;
  };

  if (playlistSongs.isError) {
    return <Text>Error fetching playlist songs. Please try again.</Text>;
  };

  if (!playlistSongs.data || !playlistSongs.data.songs || playlistSongs.data.songs.length === 0) {
    return <Text>No songs available in this playlist.</Text>;
  };

  const separator = () => {
    return <View style={styles.separator} />;
  };

  const playlistSongListItem = ({ item, index }) => {
    return (
      <PlaylistSongListItem
        item={item}
        handlePress={() => {
          for (song of playlistSongs.data.songs) {
            setPlaylistSong(song.version._id);
          };
          router.navigate('/display-playlist');
        }}
        handleDeletePress={() => {
          console.log('asd')
          deletePlaylistSong.mutate(
            {
              song: index,
              playlist: playlistSongs.data,
            },
            {
              onSuccess: () => {
                playlistSongs.refetch();
                queryClient.invalidateQueries(['playlists']);
              },
              onError: (err) => {
                console.log(err.response?.data || err.message);
              },
            }
          );
        }}
      />)
  };

  return (
    <>
      {console.log('playlistSongs', playlistSongs.data)}
      <FlashList
        data={playlistSongs.data.songs}
        renderItem={({ item, index }) => playlistSongListItem({ item, index })}
        estimatedItemSize={20}
        ItemSeparatorComponent={separator}
        contentContainerStyle={{ paddingBottom: 85 }}
      />
      <TabPlaylistPlayButton />
    </>
  );
};

export default PlaylistSongs
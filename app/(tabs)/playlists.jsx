import { View, Text, } from 'react-native';
import React, { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { styles } from '../../style/styles';
import { FlashList } from '@shopify/flash-list';
import { useNetworkStore, useModalStore, usePlaylistStore, useUserStore, useOfflineStore } from '../../state/store';
import { usePlaylists } from '../../hooks/usePlaylists';
import PlaylistListItem from '../../components/PlaylistListItem';
import OptionsModal from '../../components/OptionsModal';
import PlaylistNameModal from '../../components/PlaylistNameModal';
import { showMessage } from 'react-native-flash-message';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SharePlaylistModal from '../../components/SharePlaylistModal';

const Playlists = () => {

  const [storedPlaylists, setStoredPlaylists] = useState([]);

  const isConnected = useNetworkStore((state) => state.isConnected);
  const playlistId = usePlaylistStore((state) => state.playlistId);
  const user = useUserStore((state) => state.user);

  const setPlaylistJSON = useOfflineStore((state) => state.setPlaylistJSON)
  const setPlaylistId = usePlaylistStore((state) => state.setPlaylistId);
  const setPlaylistName = usePlaylistStore((state) => state.setPlaylistName);
  const setModalOptions = useModalStore((state) => state.setModalOptions);

  const playlists = usePlaylists(user.id);

  useFocusEffect(
    useCallback(() => {
      if (!isConnected) {
        const getStoredPlaylists = async () => {
          try {
            const allKeys = await AsyncStorage.getAllKeys();
            const playlistKeys = allKeys.filter((key) => key.startsWith('playlist_'));

            const storedJSONPlaylists = await AsyncStorage.multiGet(playlistKeys);
            const playlistsJSON = storedJSONPlaylists
              .map(([key, value]) => {
                try {
                  return JSON.parse(value);
                } catch {
                  return null;
                }
              })
              .filter(Boolean);

            setStoredPlaylists(playlistsJSON);
          } catch (error) {
            console.error('Error retrieving stored playlists:', error);
            showMessage({
              message: 'Error retrieving stored playlists',
              description: error.message,
              type: 'danger',
            });
            setStoredPlaylists([]);
          }
        };

        getStoredPlaylists();
      }
    }, [isConnected])
  );

  const separator = () => {
    return <View style={styles.separator} />;
  };

  const playlistListItem = ({ item }) => {
    return <PlaylistListItem
      item={item}
      handlePress={() => {
        setPlaylistId(item.playlist_id._id);
        setPlaylistName(item.playlist_id.name);
        if (!isConnected) {
          setPlaylistJSON(item);
        }
        router.navigate('/playlist-songs');
      }}
      handleLongPress={() => {
        setPlaylistName(item.playlist_id.name);
        setPlaylistId(item.playlist_id._id);
        setModalOptions();
      }}
    />
  };

  if (!isConnected) {
    return (
      <>
        <View style={styles.offlineContainer}>
          <MaterialCommunityIcons name="cloud-off-outline" size={24} color="#D32F2F" />
          <Text style={styles.offlineText}>
            You are offline. Showing downloaded playlists only.
          </Text>
        </View>
        {storedPlaylists.length > 0 ? (
          <FlashList
            data={storedPlaylists}
            renderItem={playlistListItem}
            estimatedItemSize={20}
            ItemSeparatorComponent={separator}
            contentContainerStyle={{ paddingBottom: 85 }}
          />
        ) : (
          <View style={styles.noSongsContainer}>
            <Text style={styles.noSongsText}>No playlists downloaded for offline use.</Text>
          </View>
        )}
      </>
    );
  }

  if (playlists.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (playlists.isError) {
    showMessage({
      message: 'Error',
      description: playlists.error.message,
      type: 'danger',
    });
    return <Text>There has been error</Text>;
  }

  if (!playlists.data?.length) {
    return (
      <View style={styles.noSongsContainer}>
        <PlaylistNameModal />
        <Text style={styles.noSongsText}>You have no playlists yet.</Text>
      </View>
    )
  }

  return (
    <>
      <OptionsModal />
      <PlaylistNameModal />
      <FlashList
        data={playlists.data}
        renderItem={playlistListItem}
        estimatedItemSize={20}
        ItemSeparatorComponent={separator}
        contentContainerStyle={{ paddingBottom: 85 }}
      />
      <SharePlaylistModal userId={user.id} playlistId={playlistId} />
    </>
  );
};

export default Playlists;
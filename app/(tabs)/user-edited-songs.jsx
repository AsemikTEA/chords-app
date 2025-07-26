import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import { FlashList } from '@shopify/flash-list';
import { useNetworkStore, useOfflineStore, useSongVersionStore, useUserStore } from '../../state/store';
import { useSearchPersonalVersions } from '../../hooks/useSearchPersonalVersions';
import AntDesign from '@expo/vector-icons/AntDesign';
import { showMessage } from 'react-native-flash-message';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDeletePersonalVersion } from '../../hooks/useDeletePersonalVersion';

const UserEditedSongs = () => {

  const [storedSongs, setStoredSongs] = useState([]);

  const queryClient = useQueryClient();

  const isConnected = useNetworkStore((state) => state.isConnected);
  const userData = useUserStore((state) => state.user);
  const setVersionId = useSongVersionStore((state) => state.setVersionId);
  const setSongJSON = useOfflineStore((state) => state.setSongJSON);

  const personalVersions = useSearchPersonalVersions(userData.id);
  const deletePersonalVersion = useDeletePersonalVersion();

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['personal-version'] });
      console.log('UserEditedSongs: useFocusEffect - personalVersions invalidated');

      return;
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (!isConnected) {
        const getStoredSongs = async () => {
          try {
            const allKeys = await AsyncStorage.getAllKeys();
            const songKeys = allKeys.filter((key) => key.startsWith('song_'));

            const storedJSONSongs = await AsyncStorage.multiGet(songKeys);
            const songs = storedJSONSongs
              .map(([key, value]) => {
                try {
                  return JSON.parse(value);
                } catch {
                  return null;
                }
              })
              .filter(Boolean);

            setStoredSongs(songs);
          } catch (error) {
            console.error('Error retrieving stored songs:', error);
            showMessage({
              message: 'Error retrieving stored songs',
              description: error.message,
              type: 'danger',
            });
            setStoredSongs([]);
          }
        };

        getStoredSongs();
      }
    }, [isConnected])
  );

  const handleDeletePersonalVersion = async (item) => {
    deletePersonalVersion.mutateAsync(item._id, {
      onSuccess: () => {
        showMessage({
          message: 'Your version has been succesfully deleted.',
          type: 'success',
        });
        queryClient.invalidateQueries(['personal-version']);
      },
      onError: () => {
        showMessage({
          message: 'Error retrieving stored songs',
          description: error.message,
          type: 'danger',
        });
      }
    })
  }

  const separator = () => {
    return <View style={styles.separator} />;
  };

  const versionListItem = ({ item }) => {
    const hasTransposition = item.userTransposition !== undefined && item.userTransposition !== 0;

    return (
      <TouchableOpacity
        style={styles2.itemContainer}
        onPress={() => {
          setVersionId(item._id);
          if (!isConnected) setSongJSON(item);
          router.navigate('/display');
        }}
      >
        <View style={styles2.leftSection}>
          <MaterialCommunityIcons name="music-note" size={20} color="#000" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles2.songTitle}>{item.metadata?.title ?? 'Unknown title'}</Text>
            <Text style={styles2.songSub}>{item.metadata?.artist ?? 'Unknown artist'}</Text>
            <Text style={styles2.songSub}>Version: {item.version ?? 'N/A'}</Text>
          </View>
        </View>

        <View style={styles2.rightSection}>
          <View style={{ flex: 1 }}>
            {hasTransposition && (
              <Text style={styles2.transposition}>♭#: {item.userTransposition}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'flex-end'
              }}
              onPress={() => handleDeletePersonalVersion(item)}
            >
              <AntDesign name="close" size={22} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!isConnected) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: 40 }]} edges={['bottom', 'left', 'right']}>
        <View style={styles.offlineContainer}>
          <MaterialCommunityIcons name="cloud-off-outline" size={24} color="#D32F2F" />
          <Text style={styles.offlineText}>
            You are offline. Showing downloaded songs only.
          </Text>
        </View>

        {storedSongs.length > 0 ? (
          <FlashList
            data={storedSongs}
            renderItem={versionListItem}
            estimatedItemSize={20}
            ItemSeparatorComponent={separator}
            contentContainerStyle={{ paddingBottom: 85 }}
          />
        ) : (
          <View style={styles.noSongsContainer}>
            <Text style={styles.noSongsText}>No songs downloaded for offline use.</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  if (!personalVersions.data?.length) {
    return (
      <View style={styles.noSongsContainer}>
        <Text style={styles.noSongsText}>Here will be displayed your edited songs, when you have any.</Text>
      </View>
    )
  }

  if (personalVersions.isLoading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (personalVersions.isError) {
    showMessage({
      message: 'Error loading personal versions',
      description: personalVersions.error.message,
      type: 'danger',
    });
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.noSongsContainer}>
          <Text style={styles.noSongsText}>Error: {personalVersions.error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <View style={{ marginTop: 40 }} />
      <FlashList
        data={personalVersions.data}
        renderItem={versionListItem}
        estimatedItemSize={20}
        ItemSeparatorComponent={separator}
        contentContainerStyle={{ paddingBottom: 85 }}
      />
    </SafeAreaView>
  );
};

export default UserEditedSongs;

const styles2 = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
  },

  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  songSub: {
    fontSize: 15,
    color: '#444',
  },

  rightSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 6,
  },

  transposition: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
})
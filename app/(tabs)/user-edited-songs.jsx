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

const UserEditedSongs = () => {

  const [storedSongs, setStoredSongs] = useState([]);

  const queryClient = useQueryClient();

  const isConnected = useNetworkStore((state) => state.isConnected);
  const userData = useUserStore((state) => state.user);
  const setVersionId = useSongVersionStore((state) => state.setVersionId);
  const setSongJSON = useOfflineStore((state) => state.setSongJSON);

  const personalVersions = useSearchPersonalVersions(userData.id);

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


  const separator = () => {
    return <View style={styles.separator} />;
  };

  const versionListItem = ({ item }) => {
    return (
      <>
        <TouchableOpacity
          style={[styles.listItem, { flexDirection: 'row' }]}
          onPress={() => {
            setVersionId(item._id);
            if (!isConnected) {
              setSongJSON(item);
            }
            router.navigate('/display');
          }}
        >
          <View style={{ flex: 3 }}>
            <Text style={styles.listItemSongName}>
              {item.metadata?.title ?? 'Unknown title'}
            </Text>
            <Text style={styles.listItemAuthor}>
              {item.metadata?.artist ?? 'Unknown artist'}
            </Text>
            <Text style={styles.listItemAuthor}>
              Version: {item.version ?? 'N/A'}
            </Text>
          </View>
          <View style={{ flex: 1.8 }}>
            {(item.userTransposition !== undefined && item.userTransposition !== 0) &&
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
                <Text style={{ fontSize: 16 }}>Your</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name="music-accidental-flat"
                    size={24}
                    color="black"
                    style={{ padding: 0, marginRight: -7 }} // zmenšíme mezeru mezi ♭ a ♯
                  />
                  <MaterialCommunityIcons
                    name="music-accidental-sharp"
                    size={24}
                    color="black"
                    style={{ padding: 0, marginLeft: -7, marginRight: -5 }} // zmenšíme mezeru mezi ♭ a ♯
                  />
                </View>
                <Text style={{ fontSize: 16 }}>: {item.userTransposition}</Text>
              </View>
            }
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => console.log('pressed')}
            >
              <AntDesign name="close" size={28} color="black" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </>
    )
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
        <View>
          <Text>Error: {personalVersions.error.message}</Text>
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
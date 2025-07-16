import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchForm from '../../components/SearchForm';
import { styles } from '../../style/styles';
import { FlashList } from '@shopify/flash-list';
import SongListItem from '../../components/SongListItem';
import { useNetworkStore, useSearchStore, useSongContentStore, useSongVersionStore } from '../../state/store';
import { useSearchSongs } from '../../hooks/useSearchSong';
import { useDebounce } from '../../hooks/useDebounce';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Search = () => {

  const isConnected = useNetworkStore((state) => state.isConnected);

  const songName = useSearchStore((state) => state.songName);
  const debouncedSearch = useDebounce(songName);

  const setSongId = useSongVersionStore((state) => state.setSongId);
  const setTitle = useSongContentStore((state) => state.setTitle);
  const setArtist = useSongContentStore((state) => state.setArtist);

  const songs = useSearchSongs(debouncedSearch);

  useEffect(() => {
    songs.refetch();
  }, [debouncedSearch]);

  const separator = () => {
    return <View style={styles.separator} />;
  };

  const songListItem = ({ item }) => {
    return <SongListItem
      item={item}
      handlePress={() => {
        console.log('data v itemu', item)
        setTitle(item.name);
        setArtist(item.artist[0].name);
        setSongId(item._id); 
        router.navigate('/song-versions'); 
      }}
    />
  };

  if (!isConnected) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: 40 }]} edges={['bottom', 'left', 'right']}>
        <View style={styles.offlineContainer}>
          <MaterialCommunityIcons name="cloud-off-outline" size={24} color="#D32F2F" />
          <Text style={styles.offlineText}>
            You are offline. Please connect back to internet to search songs.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (songs.isLoading) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['bottom', 'left', 'right']}
      >
        <SearchForm />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <SearchForm />
      <FlashList
        data={songs.data}
        renderItem={songListItem}
        estimatedItemSize={20}
        ItemSeparatorComponent={separator}
        contentContainerStyle={{ paddingBottom: 85 }}
      />
    </SafeAreaView>
  );
};

export default Search;
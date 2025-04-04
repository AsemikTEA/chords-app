import { View } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchForm from '../../components/SearchForm';
import { styles } from '../../style/styles';
import { FlashList } from '@shopify/flash-list';
import SongListItem from '../../components/SongListItem';
import { useSearchStore, useSongContentStore, useSongVersionStore } from '../../state/store';
import { useSearchSongs } from '../../hooks/useSearchSong';
import { useDebounce } from '../../hooks/useDebounce';

const Search = () => {

  const songName = useSearchStore((state) => state.songName);
  const debouncedSearch = useDebounce(songName);

  const setSongId = useSongVersionStore((state) => state.setSongId);
  const setTitle = useSongContentStore((state) => state.setTitle);
  const setArtist = useSongContentStore((state) => state.setTitle);

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
        setTitle(item.name);
        //setArtist();
        setSongId(item._id); 
        router.navigate('/song-versions'); 
      }}
    />
  };

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
      />
    </SafeAreaView>
  );
};

export default Search;
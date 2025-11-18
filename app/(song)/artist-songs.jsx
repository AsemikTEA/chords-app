import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { FlashList } from '@shopify/flash-list';
import { styles } from '../../style/styles';
import VersionListItem from '../../components/VersionListItem';
import { router, useNavigation } from 'expo-router';
import { useSongVersions } from '../../hooks/useSongVersions';
import { useSearchStore, useSongContentStore, useSongVersionStore, useUserStore } from '../../state/store';
import Header from '../../components/Header';
import { useSearchSongsByArtist } from '../../hooks/useSearchSongsByArtist';
import SongListItem from '../../components/SongListItem';

const ArtistSongs = () => {

  const navigation = useNavigation();

  const artistId = useSearchStore((state) => state.artistId);
  const songMetaData = useSongContentStore((state) => state.songMetaData);

  const setSongId = useSongVersionStore((state) => state.setSongId);
  const setTitle = useSongContentStore((state) => state.setTitle);
  const setArtist = useSongContentStore((state) => state.setArtist);

  const artistSongs = useSearchSongsByArtist(artistId);

  useEffect(() => {
    console.log('songMetaData v headeru:', songMetaData);
    navigation.setOptions({
      header: () => <Header
        song={songMetaData?.artist ?? ''}
      />
    });
  }, [navigation, songMetaData]);

  const separator = () => {
    return <View style={styles.separator} />;
  };

  const songListItem = ({ item }) => {
    return (
      <SongListItem
        item={item}
        handlePress={() => {
          console.log('data v itemu', item)
          setTitle(item.name);
          setArtist(item.artist_id[0].name);
          setSongId(item._id);
          router.navigate('/song-versions');
        }}
        handlePressArtist={() => console.log('Artist clicked.')}
      />
    );
  };

  if (artistSongs.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (artistSongs.isPending) {
    return <Text>Loading...</Text>;
  }

  if (artistSongs.isError) {
    return <Text>Error fetching artist songs. Please try again.</Text>;
  }

  if (!artistSongs.data || !artistSongs.data.length === 0) {
    return <Text>No songs available for this artist.</Text>;
  }

  return (
    <>
      <FlashList
        data={artistSongs.data}
        renderItem={songListItem}
        estimatedItemSize={20}
        ItemSeparatorComponent={separator}
      />
    </>
  );
}

export default ArtistSongs;
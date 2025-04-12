import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchForm from '../../components/SearchForm';
import { styles } from '../../style/styles';
import { FlashList } from '@shopify/flash-list';
import SongListItem from '../../components/SongListItem';
import { useSearchStore, useSongContentStore, useSongVersionStore, useUserStore } from '../../state/store';
import { useSearchSongs } from '../../hooks/useSearchSong';
import { useDebounce } from '../../hooks/useDebounce';
import { useSearchPersonalVersions } from '../../hooks/useSearchPersonalVersions';
import AntDesign from '@expo/vector-icons/AntDesign';

const UserEditedSongs = () => {

  const userData = useUserStore((state) => state.user);
  const songName = useSearchStore((state) => state.songName);
  const debouncedSearch = useDebounce(songName);

  const setSongId = useSongVersionStore((state) => state.setSongId);
  const setTitle = useSongContentStore((state) => state.setTitle);
  const setArtist = useSongContentStore((state) => state.setTitle);
  const setVersionId = useSongVersionStore((state) => state.setVersionId);

  const personalVersions = useSearchPersonalVersions(userData.id);

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
            router.navigate('/display');
          }}
        >
          <View style={{ flex: 3 }}>
            <Text style={styles.listItemSongName}>{item.metadata.title}</Text>
            <Text style={styles.listItemAuthor}>{item.metadata.artist}</Text>
            <Text style={styles.listItemAuthor}>Version: {item.version}</Text>
          </View>
          <View style={{ flex: 1.8 }}>
            {item.metadata.transposition && (
              <Text>transposition: {item.metadata.transposition}</Text>
            )}
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

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      {/* <SearchForm /> */}
      <View style={{ marginTop: 40 }} />
      <FlashList
        data={personalVersions.data}
        renderItem={versionListItem}
        estimatedItemSize={20}
        ItemSeparatorComponent={separator}
      />
    </SafeAreaView>
  );
};

export default UserEditedSongs;
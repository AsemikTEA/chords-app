import { View, Text, } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import { FlashList } from '@shopify/flash-list';
import { useModalStore, usePlaylistStore, useUserStore } from '../../state/store';
import { usePlaylists } from '../../hooks/usePlaylists';
import PlaylistListItem from '../../components/PlaylistListItem';
import OptionsModal from '../../components/OptionsModal';
import PlaylistNameModal from '../../components/PlaylistNameModal';
import { showMessage } from 'react-native-flash-message';

const Playlists = () => {

  const user = useUserStore((state) => state.user);

  const setPlaylistId = usePlaylistStore((state) => state.setPlaylistId);
  const setPlaylistName = usePlaylistStore((state) => state.setPlaylistName);
  const setModalOptions = useModalStore((state) => state.setModalOptions);

  const playlists = usePlaylists(user.id);

  const separator = () => {
    return <View style={styles.separator} />;
  };

  const playlistListItem = ({ item }) => {
    return <PlaylistListItem
      item={item}
      handlePress={() => {
        setPlaylistId(item._id);
        setPlaylistName(item.name);
        router.navigate('/playlist-songs');
      }}
      handleLongPress={() => {
        setPlaylistName(item.name);
        setPlaylistId(item._id);
        setModalOptions();
      }}
    />
  };

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

  if (!playlists.data) {
    return <Text>There are no playlists for you.</Text>
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <OptionsModal/>
      <PlaylistNameModal/>
      <FlashList
        data={playlists.data}
        renderItem={playlistListItem}
        estimatedItemSize={20}
        ItemSeparatorComponent={separator}
      />
    </SafeAreaView>
  );
};

export default Playlists;
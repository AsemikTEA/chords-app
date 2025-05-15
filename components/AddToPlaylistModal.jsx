import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { useModalStore, useUserStore } from '../state/store';
import PlaylistListItem from './PlaylistListItem';
import { styles } from '../style/styles';
import { FlashList } from '@shopify/flash-list';
import { usePlaylists } from '../hooks/usePlaylists';
import { useAddToPlaylist } from '../hooks/useAddToPlaylist';
import { useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';

const AddToPlaylistModal = ({ version }) => {

  const queryClient = useQueryClient();

  const user = useUserStore((state) => state.user);
  const modalVisible = useModalStore((state) => state.modalVisible);

  const playlists = usePlaylists(user.id, modalVisible);
  const addToPlaylist = useAddToPlaylist();

  const setModalVisible = useModalStore((state) => state.setModalVisible);

  const separator = () => {
    return <View style={styles.separator} />;
  };

  const playlistListItem = ({ item }) => {
    return <PlaylistListItem
      item={item}
      handlePress={() => {
        addToPlaylist.mutate(
          {
            playlist: item,
            songToAdd: version
          },
        );
        setModalVisible();
      }}
    />
  };

  return (
    <Modal
      animationType='none'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => { setModalVisible() }}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPressOut={() => { setModalVisible() }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '90%', height: '90%', backgroundColor: 'white', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, }}>
            <FlashList
              data={playlists.data}
              renderItem={playlistListItem}
              estimatedItemSize={20}
              ItemSeparatorComponent={separator}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default AddToPlaylistModal;
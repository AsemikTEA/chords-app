import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from '../style/styles';
import { useModalStore, usePlaylistStore, useUserStore } from '../state/store';
import { usePlaylists } from '../hooks/usePlaylists';
import { useDeletePlaylist } from '../hooks/useDeletePlaylist';

const OptionsModal = () => {

  const user = useUserStore((state) => state.user);
  const modalOptions = useModalStore((state) => state.modalOptions);
  const playlistId = usePlaylistStore((state) => state.playlistId);

  const setModalOptions = useModalStore((state) => state.setModalOptions);
  const setModalVisible = useModalStore((state) => state.setModalVisible);
  const setPlaylistName = usePlaylistStore((state) => state.setPlaylistName);

  const playlists = usePlaylists(user.id);
  const deletePlaylist = useDeletePlaylist();

  return (
    <Modal
      animationType='none'
      transparent={true}
      visible={modalOptions}
      onRequestClose={() => { 
        setModalOptions();
        setPlaylistName('');
        }}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPressOut={() => { 
          setModalOptions();
          setPlaylistName('');
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.button}
              onPress={() => {
                setModalOptions();
                setModalVisible();
              }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Rename Playlist</Text>
            </Pressable>
            <Pressable
              style={styles.buttonDelete}
              onPress={() => {
                deletePlaylist.mutate(
                  { id: playlistId },
                  {
                    onSuccess: () => {
                      playlists.refetch();
                    }
                  }
                );
                setModalOptions();
              }}>
              <Text style={styles.textStyle}>Delete Playlist</Text>
            </Pressable>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default OptionsModal;
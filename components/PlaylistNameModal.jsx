import { View, Modal, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from '../style/styles';
import { useModalStore, usePlaylistStore, useUserStore } from '../state/store';
import { useCreatePlaylist } from '../hooks/useCreatePlaylist';
import FormField from './FormField';
import SubmitButton from './SubmitButton';
import { usePlaylists } from '../hooks/usePlaylists';
import { useRenamePlaylist } from '../hooks/useRenamePlaylist';

const PlaylistNameModal = () => {

  const user = useUserStore((state) => state.user);
  const modalVisible = useModalStore((state) => state.modalVisible);
  const playlistName = usePlaylistStore((state) => state.playlistName);
  const playlistId = usePlaylistStore((state) => state.playlistId);

  const setPlaylistName = usePlaylistStore((state) => state.setPlaylistName);
  const setModalVisible = useModalStore((state) => state.setModalVisible);

  const createPlaylist = useCreatePlaylist();
  const renamePlaylist = useRenamePlaylist();

  const playlists = usePlaylists(user.id);

  const createPlaylistSuccess = () => {
    setPlaylistName('');
    setModalVisible(!modalVisible);
    playlists.refetch();
  }


  return (
    <Modal
      animationType='none'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible();
        setPlaylistName('')
      }}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPressOut={() => {
          setModalVisible();
          setPlaylistName('')
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FormField
              title="Playlist name"
              value={playlistName}
              handleChangeText={(e) => { setPlaylistName(e) }}
              keyboardType="email-address"
              style={styles.formField}
              placeholder={"Enter playlist name"}
            />
            {!playlistName && (
              <SubmitButton
              handlePress={() => {
                createPlaylist.mutate(
                  {
                    name: playlistName,
                    user_id: user.id,
                    token: user.token,
                  },
                  {
                    onSuccess: () => {
                      createPlaylistSuccess();
                    }
                  }
                )
              }}
              textValue={'Create Playlist'}
              style={[styles.submitButton, { width: '80%' }]}
            />
            ) || (
              <SubmitButton
              handlePress={() => {
                renamePlaylist.mutate(
                  {
                    id: playlistId,
                    name: playlistName,
                  },
                  {
                    onSuccess: () => {
                      createPlaylistSuccess();
                    }
                  }
                )
              }}
              textValue={'Rename Playlist'}
              style={[styles.submitButton, { width: '80%' }]}
            />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default PlaylistNameModal;
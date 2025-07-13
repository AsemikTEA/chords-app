import { View, Modal, TouchableOpacity, TextInput, Text } from 'react-native';
import React from 'react';
import { styles } from '../style/styles';
import { useModalStore, usePlaylistStore, useUserStore } from '../state/store';
import { useCreatePlaylist } from '../hooks/useCreatePlaylist';
import { usePlaylists } from '../hooks/usePlaylists';
import { useRenamePlaylist } from '../hooks/useRenamePlaylist';
import { Controller, useForm } from 'react-hook-form';
import SubmitButton from './SubmitButton';
import { Ionicons } from '@expo/vector-icons';
import { showMessage } from 'react-native-flash-message';

const PlaylistNameModal = () => {
  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      playlistName: '',
    },
  });

  const user = useUserStore((state) => state.user);
  const modalVisible = useModalStore((state) => state.playlistNameModal);
  const playlistName = usePlaylistStore((state) => state.playlistName);
  const playlistId = usePlaylistStore((state) => state.playlistId);
  const setModalVisible = useModalStore((state) => state.setPlaylistNameModal);
  const setPlaylistName = usePlaylistStore((state) => state.setPlaylistName);

  const createPlaylist = useCreatePlaylist();
  const renamePlaylist = useRenamePlaylist();
  const playlists = usePlaylists(user.id);

  const closeModal = () => {
    setModalVisible();
    setPlaylistName('');
    reset();
  };

  const onSubmit = (data) => {
    const action = playlistName ? renamePlaylist : createPlaylist;
    const payload = playlistName
      ? { id: playlistId, name: data.playlistName }
      : { name: data.playlistName, user_id: user.id, token: user.token };

    action.mutate(payload, {
      onSuccess: () => {
        showMessage({
          message: playlistName ? 'Playlist renamed successfully' : 'Playlist created successfully',
          type: 'success',
        });
        closeModal();
        playlists.refetch();
      },
      onError: (err) => {
        showMessage({
          message: playlistName ? 'Failed to rename playlist' : 'Failed to create playlist',
          type: 'danger',
        });
        console.log(err.response?.data || err.message);
      },
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <TouchableOpacity onPress={closeModal} style={styles.modalCloseIcon}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>
            {playlistName ? 'Rename Playlist' : 'Create New Playlist'}
          </Text>

          <Controller
            control={control}
            name="playlistName"
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.formTextInputModal}
                placeholder="Enter playlist name"
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  clearErrors('FORM_ERROR');
                }}
                value={value}
              />
            )}
          />
          {errors.playlistName && (
            <Text style={styles.error}>{errors.playlistName.message}</Text>
          )}

          <TouchableOpacity
            style={[styles.submitButtonModal, { width: '100%', marginTop: 16 }]}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.submitButtonTextModal}>{playlistName ? 'Rename Playlist' : 'Create Playlist'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PlaylistNameModal;
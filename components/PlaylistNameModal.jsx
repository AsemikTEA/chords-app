import { View, Modal, TouchableOpacity, TextInput, Text } from 'react-native';
import React from 'react';
import { styles } from '../style/styles';
import { useModalStore, usePlaylistStore, useUserStore } from '../state/store';
import { useCreatePlaylist } from '../hooks/useCreatePlaylist';
import FormField from './FormField';
import SubmitButton from './SubmitButton';
import { usePlaylists } from '../hooks/usePlaylists';
import { useRenamePlaylist } from '../hooks/useRenamePlaylist';
import { Controller, useForm } from 'react-hook-form';

const PlaylistNameModal = () => {

  const {
    control,
    handleSubmit,
    setError,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      playlistName: playlistName,
    }
  });

  const user = useUserStore((state) => state.user);
  const modalVisible = useModalStore((state) => state.modalVisible);
  const playlistName = usePlaylistStore((state) => state.playlistName);
  const playlistId = usePlaylistStore((state) => state.playlistId);

  const setModalVisible = useModalStore((state) => state.setModalVisible);
  const setPlaylistName = usePlaylistStore((state) => state.setPlaylistName);

  const createPlaylist = useCreatePlaylist();
  const renamePlaylist = useRenamePlaylist();

  const playlists = usePlaylists(user.id);

  const createPlaylistSuccess = () => {
    setModalVisible(!modalVisible);
    reset();
    playlists.refetch();
  }

  const onSubmitCreate = (data) => {
    createPlaylist.mutate(
      {
        name: data.playlistName,
        user_id: user.id,
        token: user.token,
      },
      {
        onSuccess: () => {
          createPlaylistSuccess();
        }
      }
    );
  };

  const onSubmitChange = (data) => {
    renamePlaylist.mutate(
      {
        id: playlistId,
        name: data.playlistName,
      },
      {
        onSuccess: () => {
          createPlaylistSuccess();
        }
      }
    );
  };

  return (
    <Modal
      animationType='none'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible();
        setPlaylistName('');
        reset();
      }}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPressOut={() => {
          setModalVisible();
          setPlaylistName('');
          reset();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            {/* Playlist name Field */}
            <Text style={styles.formTextStyle}>Playlist name</Text>
            <Controller
              control={control}
              name="playlistName"
              rules={{
                required: "Name is required",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.formTextInput}
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
            {errors.playlistName && <Text style={styles.error}>{errors.email.message}</Text>}
            
            {!playlistName && (
              <SubmitButton
                handlePress={
                  handleSubmit(onSubmitCreate)
                }
                textValue={'Create Playlist'}
                style={[styles.submitButton, { width: '80%' }]}
              />
            ) || (
                <SubmitButton
                  handlePress={
                    handleSubmit(onSubmitChange)
                  }
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
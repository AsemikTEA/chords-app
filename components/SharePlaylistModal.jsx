import { View, Text, Modal, TouchableOpacity, Pressable, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useState, } from 'react'
import { useShareStore, useUserStore } from '../state/store';
import { styles } from '../style/styles';
import { useSharePlaylist } from '../hooks/useSharePlaylist';

const SharePlaylistModal = ({ userId, playlistId}) => {

  const share = useShareStore((state) => state.share);
  const username = useShareStore((state) => state.username);
  const sending = useShareStore((state) => state.sending);

  const setDisableShare = useShareStore((state) => state.setDisableShare);
  const setUsername = useShareStore((state) => state.setUsername);
  const setSending = useShareStore((state) => state.setSending);

  const sharePlaylist = useSharePlaylist();

  const onSubmit = () => {
    if (!username.trim()) return;

    setSending(true);
    
    sharePlaylist.mutate(
      {
        username: username,
        senderId: userId,
        playlistId: playlistId
      },
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={share}
      onRequestClose={() => {
        setDisableShare();
      }}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPressOut={() => { setDisableShare() }}
      >
        <View style={styles2.overlay}>
          <View style={styles2.modal}>
            {/* Zavírací křížek */}
            <Pressable style={styles2.closeButton} onPress={setDisableShare}>
              <Text style={{ fontSize: 18, color: 'white' }}>✕</Text>
            </Pressable>

            <Text style={styles2.title}>Share with user</Text>

            <TextInput
              style={styles2.input}
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
              editable={!sending}
            />

            <Pressable
              onPress={onSubmit}
              style={[
                styles2.button,
                sending ? { backgroundColor: '#aaa' } : {},
              ]}
              disabled={sending}
            >
              <Text style={styles2.buttonText}>
                {sending ? 'Sending...' : 'Share'}
              </Text>
            </Pressable>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default SharePlaylistModal;

const styles2 = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#24232B',
    borderRadius: 12,
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
    color: 'white',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: '600',
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#319413',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useUpdateInvitationStatus } from '../../hooks/useUpdateInvitationStatus';
import { useEffect, useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import { useSearchStore } from '../../state/store';

const Invites = () => {

  const [invites, setInvites] = useState(true);

  const rerenderHelper = useSearchStore((state) => state.rerenderHelper);

  const queryClient = useQueryClient();

  const updateStatus = useUpdateInvitationStatus();

  const recievedInvites = queryClient.getQueryData(['recievedInvites']);

  const onSubmit = async (id, status) => {
    updateStatus.mutate(
      {
        invite_id: id,
        status: status,
      },
    );
  }

  const inviteItem = ({ item }) => {
    return (
      <>
        <View style={styles2.container}>
          <View style={styles2.textBlock}>
            <Text style={styles2.playlistName}>Playlist: <Text style={{ fontWeight: 'bold' }}>{item.playlist_name}</Text></Text>
            <Text style={styles2.inviteFrom}>Invited by {item.sender_username}</Text>
          </View>

          <View style={styles2.actions}>
            <Pressable
              onPress={() => onSubmit(item._id, 'accepted')}
              style={({ pressed }) => [
                styles2.actionButton,
                styles2.acceptButton,
                pressed && styles2.pressed
              ]}>
              <Ionicons name="checkmark" size={20} color="#fff" />
            </Pressable>

            <Pressable
              onPress={() => onSubmit(item._id, 'declined')}
              style={({ pressed }) => [
                styles2.actionButton,
                styles2.rejectButton,
                pressed && styles2.pressed
              ]}>
              <Ionicons name="close" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </>
    )
  };

  if (recievedInvites.data.length === 0) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['bottom', 'left', 'right']}
      >
        <View style={{marginBottom: 100, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Text>No invites available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <FlashList
        data={recievedInvites.data}
        renderItem={inviteItem}
        estimatedItemSize={20}
      />
    </SafeAreaView>
  );
};

export default Invites;

const styles2 = StyleSheet.create({
  container: {
    backgroundColor: '#2c2c34',
    borderRadius: 20,
    padding: 16,
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    marginLeft: 10,
    marginRight: 10,
  },
  textBlock: {
    flex: 1,
  },
  playlistName: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 4,
  },
  inviteFrom: {
    fontSize: 14,
    color: '#ccc',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  pressed: {
    opacity: 0.75,
  },
});
import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
//import { styles } from '../../style/styles'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store';
import { useSharePlaylistInvites } from '../../hooks/useSharePlaylistInvites'
import { useUserStore } from '../../state/store'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Account = () => {

  const user = useUserStore((state) => state.user);

  const recievedInvites = useSharePlaylistInvites(user?.id);

  const removeToken = async () => {
    try {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      console.log('Token removed successfully');
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingLeft: 16, paddingRight: 16 }}>
        <Pressable style={styles.darkButton} onPress={() => router.navigate('/create')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="file-music-outline" size={24} color="white" />
            <Text style={styles.darkButtonText}>Create Song</Text>
          </View>
        </Pressable>

        <Pressable style={styles.darkButton} onPress={removeToken}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="door-open" size={24} color="white" />
            <Text style={styles.darkButtonText}>Log Out</Text>
          </View>
        </Pressable>

        <Pressable style={styles.darkButton} onPress={() => router.navigate('/invites')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="account-multiple-outline" size={24} color="white" />
            <Text style={styles.darkButtonText}>Invites to Share Playlist</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default Account;

const styles = StyleSheet.create({
  darkButton: {
    backgroundColor: '#24232B',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  darkButtonText: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: '500',
    color: '#fff',
  },
});
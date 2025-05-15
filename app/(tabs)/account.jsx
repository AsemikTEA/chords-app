import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../../style/styles'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store';
import { useSharePlaylistInvites } from '../../hooks/useSharePlaylistInvites'
import { useUserStore } from '../../state/store'

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
      <View style={{padding: 10}}>
      <Pressable 
        style={{borderWidth: 1, height: 50, justifyContent: 'center', padding: 5}}
        onPress={() => { router.navigate('/create') }}
        >
        <Text style={{fontSize: 20}}>Create song</Text>
      </Pressable>
      <Pressable 
        style={{borderWidth: 1, height: 50, justifyContent: 'center', padding: 5}}
        onPress={removeToken}
        >
        <Text style={{fontSize: 20}}>Log Out</Text>
      </Pressable>
      <Pressable 
        style={{borderWidth: 1, height: 50, justifyContent: 'center', padding: 5}}
        onPress={() => { router.navigate('/invites') }}
        >
        <Text style={{fontSize: 20}}>Invites to share playlist</Text>
      </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default Account
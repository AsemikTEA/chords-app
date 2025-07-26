import { StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTokenAuth } from '../hooks/useTokenAuth';
import { useEffect } from 'react';
import { useNetworkStore, useUserStore } from '../state/store';
import { useNewAccessToken } from '../hooks/useNewAccessToken';
import { showMessage } from 'react-native-flash-message';
import * as Network from 'expo-network';
import { setAuthToken } from '../api/axiosInstance';
import { retrieveToken, retrieveRefreshToken, requestNewAccessToken, checkToken } from '../api/tokenAuth';

export default function App() {

  const setIsConnected = useNetworkStore((state) => state.setIsConnected);
  const isConnected = useNetworkStore((state) => state.isConnected);

  const setId = useUserStore((state) => state.setId);
  const setUsername = useUserStore((state) => state.setUsername);
  const setEmail = useUserStore((state) => state.setEmail);

  const tokenAuth = useTokenAuth();
  const newAccessToken = useNewAccessToken();

  useEffect(() => {
    const checkTokenFunctions = {
      tokenAuth: tokenAuth,
      newAccessToken: newAccessToken,
      setId: setId,
      setUsername: setUsername,
      setEmail: setEmail
    }

    checkToken(checkTokenFunctions);
  }, []);

  useEffect(() => {
    const check = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsConnected(state.isInternetReachable);
    };

    check();
  }, []);

  if (!isConnected) {
    return (
      <View style={styles2.container}>
        <Text style={{ fontWeight: 'bold', fontSize: 40 }}>No internet connection</Text>
        <Link href="/search">Use app in offline mode</Link>
      </View>
    );
  }

  if (tokenAuth.isIdle || newAccessToken.isIdle) {
    return (
      <View style={styles2.container}>
        <Text style={{ fontWeight: 'bold', fontSize: 40 }}>Idle...</Text>
      </View>
    );
  }

  if (tokenAuth.isPending || newAccessToken.isPending) {
    return (
      <View style={styles2.container}>
        <Text style={{ fontWeight: 'bold', fontSize: 40 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles2.container}>
      <Link href="/sign-in">Jít na přihlášení</Link>
    </View>
  );
}

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTokenAuth } from '../hooks/useTokenAuth';
import { useEffect } from 'react';
import { useNetworkStore, useUserStore } from '../state/store';
import { useNewAccessToken } from '../hooks/useNewAccessToken';
import { showMessage } from 'react-native-flash-message';
import * as Network from 'expo-network';

export default function App() {

  const setIsConnected = useNetworkStore((state) => state.setIsConnected);
  const isConnected = useNetworkStore((state) => state.isConnected);

  const setId = useUserStore((state) => state.setId);
  const setUsername = useUserStore((state) => state.setUsername);
  const setEmail = useUserStore((state) => state.setEmail);

  const tokenAuth = useTokenAuth();
  const newAccessToken = useNewAccessToken();

  const retrieveToken = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('access_token');
      if (accessToken) {
        console.log('Access Token retrieved:', accessToken);
        return accessToken;
      } else {
        console.log('No token found');
        showMessage({
          message: 'Error retrieving token',
          description: error.message,
          type: 'info',
        });
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      showMessage({
        message: 'Error retrieving token',
        description: error.message,
        type: 'danger',
      });
    }
  }

  const retrieveRefreshToken = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      if (refreshToken) {
        console.log('Refresh Token retrieved:', refreshToken);
        return refreshToken;
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  }

  const checkToken = async () => {
    try {
      const accessToken = await retrieveToken();
      if (!accessToken) {
        console.log('No token found, checking refresh token');

        const refreshToken = await retrieveRefreshToken();

        if (!refreshToken) {
          console.log('No refresh token found, redirecting to sign-in page');
          router.replace('/sign-in');
          return;
        }

        await requestNewAccessToken();
        return;
      }

      const result = await tokenAuth.mutateAsync({ accessToken: accessToken });
      console.log('Token check result:', result.data.decoded);

      setId(result.data.decoded.userId);
      setUsername(result.data.decoded.username);
      setEmail(result.data.decoded.email);

      showMessage({
        message: 'Succesfully logged in',
        type: 'success',
      });

      router.replace('/search');

    } catch (error) {
      console.error('Error checking token:', error.response.data.message);

      showMessage({
        message: 'Error checking token',
        description: error.response.data.message,
        type: 'danger',
      });

      const isValid = await requestNewAccessToken();
      if (isValid) {
        showMessage({
          message: 'Succesfully logged in',
          type: 'success',
        })
      } else {
        showMessage({
          message: 'Error checking token, redirecting to sign-in page.',
          description: error.response.data.message,
          type: 'danger',
        });
      }
      return;
    }
  }

  const requestNewAccessToken = async () => {
    try {
      const refreshToken = await retrieveRefreshToken();
      if (!refreshToken) {
        console.log('No refresh token found, redirecting to sign-in page');
        router.replace('/sign-in');
        return;
      }

      const result = await newAccessToken.mutateAsync({ refreshToken: refreshToken });
      console.log('New access token:', result.data.newAccessToken);

      setId(result.data.decoded.userId);
      setUsername(result.data.decoded.username);
      setEmail(result.data.decoded.email);

      try {
        await SecureStore.setItemAsync('access_token', result.data.newAccessToken);
        await SecureStore.setItemAsync('refresh_token', result.data.newRefreshToken);
        console.log('Tokens saved successfully');

        router.replace('/search');
        return true;
      } catch (error) {
        console.error('Error saving tokens:', error);
      }

    } catch (error) {
      console.error('Error checking refresh token:', error.response.data.message);
      router.replace('/sign-in');
      return false;
    }
  }

  useEffect(() => {
    // if (isConnected === false) return;
    // if (isConnected) {
    //   checkToken();
    // };

    checkToken();
  }, []);

  useEffect(() => {
    const check = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsConnected(true);
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

  if (tokenAuth.isPending || newAccessToken.isPending || tokenAuth.isIdle || newAccessToken.isIdle) {
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

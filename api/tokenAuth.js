import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { showMessage } from 'react-native-flash-message';
import { setAuthToken } from '../api/axiosInstance';


export const retrieveToken = async () => {
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

export const retrieveRefreshToken = async () => {
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

export const checkToken = async ({tokenAuth, newAccessToken, setId, setUsername, setEmail}) => {
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

      await requestNewAccessToken({newAccessToken, setId, setUsername, setEmail});
      return;
    }
    
    const result = await tokenAuth.mutateAsync({ accessToken: accessToken });
    console.log('Token check result:', result.data.decoded);

    setId(result.data.decoded.userId);
    setUsername(result.data.decoded.username);
    setEmail(result.data.decoded.email);

    setAuthToken(accessToken);

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

    const isValid = await requestNewAccessToken({newAccessToken, setId, setUsername, setEmail});
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

export const requestNewAccessToken = async ({newAccessToken, setId, setUsername, setEmail}) => {
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

    setAuthToken(result.data.newAccessToken);

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
import * as SecureStore from 'expo-secure-store';
import { showMessage } from 'react-native-flash-message';

export const retrieveAccessToken = async () => {
  try {
    const accessToken = await SecureStore.getItemAsync('access_token');
    if (accessToken) {
      console.log('Access Token retrieved:', accessToken);
      return accessToken;
    } else {
      console.log('No token found');
      showMessage({
        message: 'Error retrieving token',
        description: 'No access token found',
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

export const setTokens = async (accessToken, refreshToken) => {
  try {
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    console.log('Tokens saved successfully');
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

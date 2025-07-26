import axios from 'axios';
import { retrieveRefreshToken } from './authStorage';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'http://10.0.0.87:3000/v1',
  timeout: 5 * 10000
});

const newAccessToken = async (token) => {
  try {
    const response = await api.post(`/users/check-refresh-token`, token);
    console.log('New access Token check response:', response);
    return response
  } catch (error) {
    console.log(error);
    throw error;
  }
}

api.interceptors.response.use((response) => { console.log(response.config.adapter); return response }, async (error) => {
  if (error.status === 401 && error.response.data.message === 'Auth failed: token expired.') {
    const originalRequest = error.config;
    console.log(error.response.data.message);
    const refreshToken = await retrieveRefreshToken();
    const result = await newAccessToken({refreshToken: refreshToken});

    try {
      await SecureStore.setItemAsync('access_token', result.data.newAccessToken);
      await SecureStore.setItemAsync('refresh_token', result.data.newRefreshToken);
      console.log('Tokens saved successfully');
      originalRequest.headers['Authorization'] = `Bearer ${result.data.newAccessToken}`;
      console.log('trying to send request again');
      setAuthToken(result.data.newAccessToken)
      return api(originalRequest);
    } catch (error) {
      console.error('Error saving tokens:', error);
      return Promise.reject(error);
    }
  }
  console.log(error.response.data.message);
  console.log('Neproch8y9 to skrz ten spravny error');
  return Promise.reject(error);
})

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Token set:', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
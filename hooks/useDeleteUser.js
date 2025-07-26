import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Alert } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import api from "../api/axiosInstance";


const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    console.log('Token removed successfully');
  } catch (error) {
    console.error('Error removing token:', error);
  }
}

const deleteUser = async (userId) => {

  try {
    const response = await api.delete(`/users/${userId}`);
    console.log(response);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      removeToken();
      console.log('deleted');
      Alert.alert('Account deleted', '', [{ text: 'Ok', style: 'default', onPress: () => router.replace('/sign-in') }]);
    },
    onError: (error) => {
      howMessage({
        message: "Error",
        description: error.response.data.message,
        type: "danger",
      });
    }
  });
}
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";

const createAccount = async (userData) => {

  const newAccountObject = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  }

  try {
    const response = await api.post(`/users/sign-up`, newAccountObject);
    //console.log(response);
    return response;
  } catch (error) {
    //console.log(error.response.data.message);
    throw error;
  }
}

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: (value) => createAccount(value),
    onSuccess: ({ status: status, data: data, response: error }) => {
      console.log(data);
      showMessage({
        message: 'Account created successfully',
        type: 'success',
      });
      router.replace('/sign-in');
    },
  });
}
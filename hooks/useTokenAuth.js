import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

const checkToken = async (accessToken) => {

  try {
    const response = await api.post(`/users/check-token`, accessToken);
    console.log('Access Token check response:', response.data);
    return response
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useTokenAuth = () => {
  return useMutation({
    mutationFn: (accessToken) => checkToken(accessToken),
  });
}
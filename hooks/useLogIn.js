import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

const logIn = async (userData) => {

  try {
    const response = await api.post(`/users/login`, userData);
    return response
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useLogIn = () => {
  return useMutation({
    mutationFn: (value) => logIn(value),
  });
}
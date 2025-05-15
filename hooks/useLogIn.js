import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const logIn = async (userData) => {

  try {
    const response = await axios.post(`https://rest-api-chords.onrender.com/v1/users/login`, userData);
    return response
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const useLogIn = () => {
  return useMutation({
    mutationFn: (value) => logIn(value),
  });
}
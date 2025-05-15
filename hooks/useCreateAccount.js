import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const createAccount = async (userData) => {

  const newAccountObject = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  }

  try {
    const response = await axios.post(`https://rest-api-chords.onrender.com/v1/users/sign-up`, newAccountObject);
    //console.log(response);
    return response;
  } catch (error) {
    console.log(error.response.data.message);
    return error;
  }
}

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: (value) => createAccount(value),
  });
}
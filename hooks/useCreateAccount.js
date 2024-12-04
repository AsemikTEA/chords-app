import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const createAccount = async (userData) => {

  const newAccountObject = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  }

  try {
    const response = await axios.post(`http://10.0.0.87:3000/v1/users/sign-up`, newAccountObject);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: (value) => createAccount(value),
  });
}
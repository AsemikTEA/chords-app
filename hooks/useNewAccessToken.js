import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const newAccessToken = async (token) => {

  try {
    const response = await axios.post(`http://10.0.0.87:3000/v1/users/check-refresh-token`, token);
    console.log('New access Token check response:', response.data);
    return response
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useNewAccessToken = () => {
  return useMutation({
    mutationFn: (token) => newAccessToken(token),
  });
}
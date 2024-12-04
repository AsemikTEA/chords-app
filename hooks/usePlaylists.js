import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUserPlaylists = async (userId) => {
  try {
    const {data: response} = await axios.get(`http://10.0.0.87:3000/v1/playlists/user-playlists/${userId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const usePlaylists = (userId) => {
  return useQuery({
    queryKey: ['playlists'],
    queryFn: ()  => fetchUserPlaylists(userId),
  });
}
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSearchSongs = async (songName) => {
  try {
    if (!songName) {
      return [];
    }
    const {data: response} = await axios.get(`http://10.0.0.87:3000/v1/songs/search/${songName}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const useSearchSongs = (songName) => {
  return useQuery({
    queryKey: ['songs'],
    queryFn: ()  => fetchSearchSongs(songName),
    enabled: false,
  });
}
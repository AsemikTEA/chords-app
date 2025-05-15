import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSearchSongs = async (songName) => {
  try {
    if (!songName) {
      return [];
    }
    const {data: response} = await axios.get(`https://rest-api-chords.onrender.com/v1/songs/search/${songName}`);
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
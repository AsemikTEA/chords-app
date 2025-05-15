import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSongVersions = async (songId) => {
  try {
    const {data: response} = await axios.get(`https://rest-api-chords.onrender.com/v1/song-versions/all-versions/${songId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const useSongVersions = (songId) => {
  return useQuery({
    queryKey: ['song-versions'],
    queryFn: ()  => fetchSongVersions(songId),
  });
}
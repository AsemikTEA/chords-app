import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSongVersions = async (songData) => {
  try {
    const {data: response} = await axios.post(`http://10.0.0.87:3000/v1/song-versions/all-versions/`, songData);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useSongVersions = (songData) => {
  return useQuery({
    queryKey: ['song-versions'],
    queryFn: ()  => fetchSongVersions(songData),
  });
}
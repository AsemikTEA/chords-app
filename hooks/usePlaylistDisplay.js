import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPlaylistSongs = async (searchObject) => {
  try {
    const {data: response} = await axios.post('https://rest-api-chords.onrender.com/v1/playlists/playlist-songs', searchObject);
    console.log("playlist data: ", response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const usePlaylistDisplay = (searchObject) => {
  return useQuery({
    queryKey: ['playlist-songs-display'],
    queryFn: ()  => fetchPlaylistSongs(searchObject),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 10,
  });
}
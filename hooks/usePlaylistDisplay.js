import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPlaylistSongs = async (playlistId) => {
  try {
    const {data: response} = await axios.get(`http://10.0.0.87:3000/v1/playlists/playlist-songs/${playlistId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const usePlaylistDisplay = (playlistId) => {
  return useQuery({
    queryKey: ['playlist-songs-display'],
    queryFn: ()  => fetchPlaylistSongs(playlistId),
  });
}
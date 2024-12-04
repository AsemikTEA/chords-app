import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPlaylistSong = async (playlistId) => {
  try {
    const {data: response} = await axios.get(`http://10.0.0.87:3000/v1/playlists/${playlistId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const usePlaylistSongs = (playlistId) => {
  return useQuery({
    queryKey: ['playlist-songs'],
    queryFn: ()  => fetchPlaylistSong(playlistId),
  });
}
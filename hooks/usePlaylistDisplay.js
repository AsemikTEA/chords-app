import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPlaylistSongs = async (searchObject) => {
  try {
    const {data: response} = await axios.post('http://10.0.0.87:3000/v1/playlists/playlist-songs', searchObject);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const usePlaylistDisplay = (searchObject) => {
  return useQuery({
    queryKey: ['playlist-songs-display'],
    queryFn: ()  => fetchPlaylistSongs(searchObject),
  });
}
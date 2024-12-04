import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const addToPlaylist = async (value) => {

  const playlistObject = {
    name: value.playlist.name,
    songs: [...value.playlist.songs, value.songToAdd],
  }

  try {
    const response = await axios.put(`http://10.0.0.87:3000/v1/playlists/${value.playlist._id}`, playlistObject);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

export const useAddToPlaylist = () => {
  return useMutation({
    mutationFn: (value) => addToPlaylist(value),
  });
}
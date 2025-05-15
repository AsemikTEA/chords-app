import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const renamePlaylist = async (value) => {

  const playlistObject = {
    name: value.name,
  }

  try {
    const response = await axios.put(`https://rest-api-chords.onrender.com/v1/playlists/${value.id}`, playlistObject);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

export const useRenamePlaylist = () => {
  return useMutation({
    mutationFn: (value) => renamePlaylist(value),
  });
}
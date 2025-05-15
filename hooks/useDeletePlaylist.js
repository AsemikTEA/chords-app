import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const deletePlaylist = async (playlistId) => {

  try {
    const response = await axios.delete(`https://rest-api-chords.onrender.com/v1/playlists/${playlistId.id}`);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

export const useDeletePlaylist = () => {
  return useMutation({
    mutationFn: (playlistId) => deletePlaylist(playlistId),
  });
}
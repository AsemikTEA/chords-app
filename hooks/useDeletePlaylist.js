import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const deletePlaylist = async (playlistId) => {

  try {
    const response = await axios.delete(`http://10.0.0.87:3000/v1/playlists/${playlistId.id}`, { data: { userId: playlistId.userId } });
    console.log(response);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useDeletePlaylist = () => {
  return useMutation({
    mutationFn: (playlistId) => deletePlaylist(playlistId),
  });
}
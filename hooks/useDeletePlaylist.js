import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

const deletePlaylist = async (playlistId) => {

  try {
    const response = await api.delete(`/playlists/${playlistId.id}`, { data: { userId: playlistId.userId } });
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
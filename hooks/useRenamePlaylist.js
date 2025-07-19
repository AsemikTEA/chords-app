import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

const renamePlaylist = async (value) => {

  const playlistObject = {
    name: value.name,
  }

  try {
    const response = await api.put(`/playlists/${value.id}`, playlistObject);
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
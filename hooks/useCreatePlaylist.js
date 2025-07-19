import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

const createPlaylist = async (data) => {

  const newPlaylistObject = {
    name: data.name,
    songs: [],
    user_id: data.user_id,
    shared_with: [],
    is_shared: false,
    token: data.token,
  }

  try {
    const response = await api.post(`/playlists/create`, newPlaylistObject);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useCreatePlaylist = () => {
  return useMutation({
    mutationFn: (value) => createPlaylist(value),
  });
}
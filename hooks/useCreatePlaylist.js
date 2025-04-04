import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const createPlaylist = async (data) => {

  const newPlaylistObject = {
    name: data.name,
    songs: [],
    user_id: data.user_id,
    token: data.token,
  }

  try {
    const response = await axios.post(`http://10.0.0.87:3000/v1/playlists/create`, newPlaylistObject);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

export const useCreatePlaylist = () => {
  return useMutation({
    mutationFn: (value) => createPlaylist(value),
  });
}
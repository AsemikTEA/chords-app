import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const renamePlaylist = async (value) => {

  const playlistObject = {
    name: value.name,
  }

  try {
    const response = await axios.put(`http://10.0.0.87:3000/v1/playlists/${value.id}`, playlistObject);
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
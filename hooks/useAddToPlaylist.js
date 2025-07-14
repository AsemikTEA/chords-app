import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { showMessage } from "react-native-flash-message";

const addToPlaylist = async (value) => {

  const playlistObject = {
    name: value.playlist.playlist_id.name,
    songs: [...value.playlist.playlist_id.songs, value.songToAdd],
  }

  try {
    const response = await axios.put(`http://10.0.0.87:3000/v1/playlists/${value.playlist.playlist_id._id}`, playlistObject);
    console.log(response);
    return response;
  } catch (error) {
    console.log('ERROR', error);
    throw error;
  }
}

export const useAddToPlaylist = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value) => addToPlaylist(value),
    onSuccess: (response) => {
      showMessage({ message: 'Song added', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
    onError: (error) => {
      showMessage({
        message: 'Error adding song',
        description: error.response?.data?.message || 'Unknown error',
        type: 'danger',
      });
    },
  });
}
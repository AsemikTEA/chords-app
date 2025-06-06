import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const deletePlaylistSong = async (value) => {

  const newSongsArray = [...value.playlist.songs];
  newSongsArray.splice(value.song, 1);

  const playlistObject = {
    name: value.playlist.name,
    songs: newSongsArray,
  }

  try {
    const response = await axios.put(`https://rest-api-chords.onrender.com/v1/playlists/${value.playlist._id}`, playlistObject);
    console.log(response);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const usePlaylistSongDelete = () => {
  return useMutation({
    mutationFn: (value) => deletePlaylistSong(value),
  });
}
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const deletePlaylistSong = async (value) => {

  const newSongsArry = value.playlist.songs.filter(song => song.version._id !== value.song.version._id);
  console.log(newSongsArry);

  const playlistObject = {
    name: value.playlist.name,
    songs: newSongsArry,
  }

  try {
    const response = await axios.put(`http://10.0.0.87:3000/v1/playlists/${value.playlist._id}`, playlistObject);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

export const usePlaylistSongDelete = () => {
  return useMutation({
    mutationFn: (value) => deletePlaylistSong(value),
  });
}
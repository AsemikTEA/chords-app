import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPlaylistSong = async (searchObject) => {

  console.log(searchObject);

  try {
    const {data: response} = await axios.post('http://10.0.0.87:3000/v1/playlists/', searchObject);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error.response);
    throw error;
  }
}

export const usePlaylistSongs = (searchObject) => {
  return useQuery({
    queryKey: ['playlist-songs'],
    queryFn: ()  => fetchPlaylistSong(searchObject),
  });
}
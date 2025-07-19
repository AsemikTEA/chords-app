import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

const fetchPlaylistSong = async (searchObject) => {

  console.log(searchObject);

  try {
    const {data: response} = await api.post('/playlists/', searchObject);
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
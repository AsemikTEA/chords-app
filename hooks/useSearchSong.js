import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

const fetchSearchSongs = async (songName) => {
  try {
    if (!songName) {
      return [];
    }
    const {data: response} = await api.get(`/songs/search/${songName}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const useSearchSongs = (songName) => {
  return useQuery({
    queryKey: ['songs'],
    queryFn: ()  => fetchSearchSongs(songName),
    enabled: false,
  });
}
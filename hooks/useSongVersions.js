import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

const fetchSongVersions = async (songData) => {
  try {
    const {data: response} = await api.post(`/song-versions/all-versions/`, songData);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useSongVersions = (songData) => {
  return useQuery({
    queryKey: ['song-versions'],
    queryFn: ()  => fetchSongVersions(songData),
  });
}
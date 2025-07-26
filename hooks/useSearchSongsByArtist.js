import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

const fetchSongsByArtist = async (artistId) => {
  try {
    if (!artistId) {
      return [];
    }
    const {data: response} = await api.get(`/songs/artist/${artistId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const useSearchSongsByArtist = (artistId) => {
  return useQuery({
    queryKey: ['artist-songs'],
    queryFn: ()  => fetchSongsByArtist(artistId),
  });
}
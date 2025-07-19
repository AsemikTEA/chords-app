import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

const fetchUserPlaylists = async (userId) => {
  try {
    const {data: response} = await api.get(`/playlists/user-playlists/${userId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error); 
    throw error;
  }
}

export const usePlaylists = (userId, enabled) => {
  return useQuery({
    queryKey: ['playlists'],
    queryFn: ()  => fetchUserPlaylists(userId),
    //enabled: enabled 
  });
}
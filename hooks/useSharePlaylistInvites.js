import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

const fetchInvites = async (userId) => {
  try {
    const response = await api.get(`/share-invites/${userId}`);
    console.log(response.data);
    console.log('fetching invites');
    return response;
  } catch (error) {
    console.log('fetching invites');
    console.log(error.response);
  }
}

export const useSharePlaylistInvites = (userId) => {
  return useQuery({
    queryKey: ['recievedInvites'],
    queryFn: ()  => fetchInvites(userId),
    refetchInterval: 5000,
    //refetchIntervalInBackground: false,
  });
}
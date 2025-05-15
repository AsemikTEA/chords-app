import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchInvites = async (userId) => {
  try {
    const response = await axios.get(`http://10.0.0.87:3000/v1/share-invites/${userId}`);
    console.log(response.data);
    console.log('fetching invites');
    return response;
  } catch (error) {
    console.log('fetching invites');
    console.log(error);
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
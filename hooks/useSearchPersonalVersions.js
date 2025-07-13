import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPersonalVersions = async (userId) => {
  try {
    const {data: response} = await axios.get(`http://10.0.0.87:3000/v1/personal-version/get-all/${userId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useSearchPersonalVersions = (userId) => {
  return useQuery({
    queryKey: ['personal-version'],
    queryFn: ()  => fetchPersonalVersions(userId)
  });
}
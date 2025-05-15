import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPersonalVersions = async (userId) => {
  try {
    const {data: response} = await axios.get(`https://rest-api-chords.onrender.com/v1/personal-version/get-all/${userId}`);
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
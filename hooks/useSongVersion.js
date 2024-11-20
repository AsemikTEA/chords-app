import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSongVersion = async (versionId) => {
  try {
    const { data: response } = await axios.get(`http://10.0.0.87:3000/v1/song-versions/${versionId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const useSongVersion = (versionId) => {
  return useQuery({
    queryKey: ['song-version'],
    queryFn: () => fetchSongVersion(versionId),
  });
}
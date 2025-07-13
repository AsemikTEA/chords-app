import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSongVersion = async (searchData) => {
  try {
    const { data: response } = await axios.post(`http://10.0.0.87:3000/v1/personal-version/get-version`, searchData);
    console.log(response);
    if (response) {
      response.model = 'Personal_version';
    }
    console.log(response);
    return response;
  } catch (error) {
    if (error?.response?.status === 404) {

      try {
        const { data: fallbackResponse } = await axios.post(`http://10.0.0.87:3000/v1/song-versions/get-version`, searchData);
        
        if (fallbackResponse) {
          fallbackResponse.model = 'Song_version';
        }
        console.log(fallbackResponse);
        return fallbackResponse;
      } catch (fallbackError) {
        console.error('Chyba při načítání veřejné verze:', fallbackError.response.data.message);
        throw fallbackError;
      }
    } else {
      console.error('Neočekávaná chyba při načítání osobní verze:', error);
      throw error;
    }
  }

  //   const { data: response } = await axios.get(`http://10.0.0.87:3000/v1/song-versions/${versionId}`);
  //   console.log(response);
  //   return response;
  // } catch (error) {
  //   console.log(error);
  // }
}

export const useSongVersion = (searchData) => {
  return useQuery({
    queryKey: ['song-version', searchData.versionId, searchData.userId],
    queryFn: () => fetchSongVersion(searchData),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  },
);
}
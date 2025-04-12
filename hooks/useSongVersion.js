import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSongVersion = async (versionId) => {
  try {
    const { data: response } = await axios.get(`http://10.0.0.87:3000/v1/personal-version/${versionId}`);
    console.log(response);
    if (response) {
      response.model = 'Personal_version';
    }
    console.log(response);
    return response;
  } catch (error) {
    if (error?.response?.status === 404) {

      try {
        const { data: fallbackResponse } = await axios.get(`http://10.0.0.87:3000/v1/song-versions/${versionId}`);
        
        if (fallbackResponse) {
          fallbackResponse.model = 'Song_version';
        }
        console.log(fallbackResponse);
        return fallbackResponse;
      } catch (fallbackError) {
        console.error('Chyba při načítání veřejné verze:', fallbackError);
      }
    } else {
      console.error('Neočekávaná chyba při načítání osobní verze:', error);
    }
  }

  //   const { data: response } = await axios.get(`http://10.0.0.87:3000/v1/song-versions/${versionId}`);
  //   console.log(response);
  //   return response;
  // } catch (error) {
  //   console.log(error);
  // }
}

export const useSongVersion = (versionId) => {
  return useQuery({
    queryKey: ['song-version'],
    queryFn: () => fetchSongVersion(versionId),
  });
}
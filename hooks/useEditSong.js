import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const editVersion = async (songData) => {
  
  const versionObject = {
    version: songData.version,
    metadata: {
      title: songData.title,
      artist: songData.artist,
      tempo: songData.tempo || null,
      key: songData.key,
      capo: songData.capo,
      duration: songData.duration || null,
      tranposition: songData.transposition || null,
    },
    content: songData.content,
    song_id: songData.songId,
    user_id: songData.userId,
  }

  try {
    const response = await axios.post(`http://10.0.0.87:3000/v1/personal-version/`, versionObject);
    console.log(response.data);
    return(response);
  } catch (error) {
    console.log(error);
  }
}

export const useEditVersion = () => {
  return useMutation({
    mutationFn: (songData) => editVersion(songData.data),
  });
}
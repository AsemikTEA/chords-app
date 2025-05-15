import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { showMessage } from "react-native-flash-message";

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
    const response = await axios.post(`https://rest-api-chords.onrender.com/v1/personal-version/`, versionObject);
    console.log(response.status);
    return (response);
  } catch (error) {
    console.log(error.response.message);
    throw error;
  }
}

export const useEditVersion = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (songData) => editVersion(songData.data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['personal-versions']});
      showMessage({
        message: "Success",
        description: "Song has been saved to your personal library",
        type: "success",
      });
    },
    onError: (error) => {
      showMessage({
        message: "Error",
        description: error.response.data.message,
        type: "danger",
      });
    },
  });
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showMessage } from "react-native-flash-message";
import api from "../api/axiosInstance";
import { router } from "expo-router";

const editVersion = async (songData) => {

  const versionObject = {
    versionId: songData.versionId,
    version: songData.data.version,
    metadata: {
      title: songData.data.title,
      artist: songData.data.artist,
      tempo: songData.data.tempo || null,
      key: songData.data.key,
      capo: songData.data.capo,
      duration: songData.data.duration || null,
      tranposition: songData.data.transposition || null,
    },
    content: songData.data.content,
    song_id: songData.data.songId,
    user_id: songData.data.userId,
  }

  try {
    const response = await api.post(`/personal-version/`, versionObject);
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
    mutationFn: (songData) => editVersion(songData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-versions'] });
      queryClient.invalidateQueries({ queryKey: ['song-version'] });
      showMessage({
        message: "Success",
        description: "Song has been saved to your personal library",
        type: "success",
      });
      router.push('/display');
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
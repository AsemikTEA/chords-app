import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";
import { showMessage } from "react-native-flash-message";

const createVersion = async (songData) => {

  const versionObject = {
    version: null,
    metadata: {
      title: songData.title,
      artist: songData.artist,
      tempo: songData.tempo || null,
      key: songData.key,
      capo: songData.capo,
      duration: songData.duration || null,
    },
    content: songData.content,
    song_id: null,
  }

  try {
    const response = await api.post(`/song-versions`, versionObject);
    console.log(response.data);
    return response
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useCreateVersion = () => {
  return useMutation({
    mutationFn: (songData) => createVersion(songData.data),
    onSuccess: () => showMessage({
      message: 'Song created successfully',
      type: 'success',
    }),
    onError: (error) => {
      console.error('Error creating song:', error);
      showMessage({
        message: 'Error creating song',
        description: error.response.data.message,
        type: 'danger',
      });
    },
  });
}
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

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
  } catch (error) {
    console.log(error);
  }
}

export const useCreateVersion = () => {
  return useMutation({
    mutationFn: (songData) => createVersion(songData.data),
  });
}
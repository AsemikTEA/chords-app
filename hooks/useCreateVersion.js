import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const createVersion = async (metadata, content) => {

  const versionObject = {
    version: null,
    metadata: {
      title: metadata.title,
      artist: metadata.artist,
      tempo: metadata.tempo || null,
      key: metadata.key,
      capo: metadata.capo,
      duration: metadata.duration || null,
    },
    content: content,
    song_id: null,
  }

  try {
    const response = await axios.post(`http://10.0.0.87:3000/v1/song-versions`, versionObject);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

export const useCreateVersion = () => {
  return useMutation({
    mutationFn: (value) => createVersion(value.metadata, value.content),
  });
}
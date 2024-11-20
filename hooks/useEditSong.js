import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const editVersion = async (versionId, metadata, content) => {

  const versionObject = {
    version: metadata.version,
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
    const response = await axios.put(`http://10.0.0.87:3000/v1/song-versions/${versionId}`, versionObject);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

export const useEditVersion = () => {
  return useMutation({
    mutationFn: (value) => editVersion(value.versionId, value.metadata, value.content),
  });
}
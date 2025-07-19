import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useShareStore } from "../state/store";
import { showMessage } from "react-native-flash-message";
import api from "../api/axiosInstance";

const sharePlaylist = async (shareInfo) => {

  try {
    const response = await api.post(`/playlists/share`, shareInfo);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useSharePlaylist = () => {

  const setDisableShare = useShareStore((state) => state.setDisableShare);
  const setUsername = useShareStore((state) => state.setUsername);
  const setSending = useShareStore((state) => state.setSending);

  return useMutation({
    mutationFn: (shareInfo) => sharePlaylist(shareInfo),
    onSuccess: (data) => {
      console.log(data.data);
      setUsername('');
      setSending(false);
      setDisableShare();
      showMessage({
        message: "Success",
        description: "Playlist shared successfully",
        type: "success",
      });
    },
    onError: (error) => {
      console.log(error.response.data);
      setSending(false);
      showMessage({
        message: "Error",
        description: error.response.data.message,
        type: "danger",
      });
    },
  });
}
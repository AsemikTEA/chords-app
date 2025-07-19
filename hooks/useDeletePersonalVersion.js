import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import api from "../api/axiosInstance";

const deletePersonalVersion = async (versionId) => {

  try {
    const response = await api.delete(`/personal-version/${versionId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useDeletePersonalVersion = () => {
  return useMutation({
    mutationFn: (versionId) => deletePersonalVersion(versionId),
  });
}
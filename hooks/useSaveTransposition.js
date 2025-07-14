import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const saveTransposition = async (transData) => {
  
  try {
    const response = await axios.put(`https://rest-api-chords.onrender.com/v1/transpositions/`, transData);
    console.log(response.data);
  } catch (error) {
    throw error;
  }
}

export const useSaveTransposition = () => {
  return useMutation({
    mutationFn: (transData) => saveTransposition(transData),
    onSuccess: (data) => {
      console.log('Transposition saved successfully:', data);
    },
    onError: (error) => {
      console.error('Error saving transposition:', error);
    },
  });
}
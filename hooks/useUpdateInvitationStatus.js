import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useShareStore } from "../state/store";
import { showMessage } from "react-native-flash-message";

const updateStatus = async (updateObject) => {

  try {
    const response = await axios.patch(`http://10.0.0.87:3000/v1/share-invites`, updateObject);
    return response
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const useUpdateInvitationStatus = () => {

  const queryClient = useQueryClient();

  const setRerenderHelper = useShareStore((state) => state.setRerenderHelper);

  return useMutation({
    mutationFn: (value) => updateStatus(value),
    onSuccess: async (data) => {
      console.log(data.data);
      try {
        await queryClient.fetchQuery({ queryKey: ['recievedInvites'] });
        await queryClient.invalidateQueries({ queryKey: ['playlists'] });
      } catch (error) {
        console.log(error);
      }
      showMessage({
        message: data.data.status === 'accepted' ? 'Invitation accepted' : 'Invitation declined',
        type: 'success',
      });
      setRerenderHelper();
    },
    onError: (error) => {
      console.log(error.response.data);
      showMessage({
        message: 'Error',
        description: error.response.data.message,
        type: 'danger',
      });
    },
  });
}
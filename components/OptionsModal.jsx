// import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
// import React from 'react';
// import { styles } from '../style/styles';
// import { useModalStore, usePlaylistStore, useUserStore } from '../state/store';
// import { usePlaylists } from '../hooks/usePlaylists';
// import { useDeletePlaylist } from '../hooks/useDeletePlaylist';
// import { showMessage } from 'react-native-flash-message';

// const OptionsModal = () => {

//   const user = useUserStore((state) => state.user);
//   const modalOptions = useModalStore((state) => state.modalOptions);
//   const playlistId = usePlaylistStore((state) => state.playlistId);

//   const setModalOptions = useModalStore((state) => state.setModalOptions);
//   const setModalVisible = useModalStore((state) => state.setPlaylistNameModal);
//   const setPlaylistName = usePlaylistStore((state) => state.setPlaylistName);

//   const playlists = usePlaylists(user.id);
//   const deletePlaylist = useDeletePlaylist();

//   return (
//     <Modal
//       animationType='none'
//       transparent={true}
//       visible={modalOptions}
//       onRequestClose={() => {
//         setModalOptions();
//         setPlaylistName('');
//       }}>
//       <TouchableOpacity
//         style={styles.container}
//         activeOpacity={1}
//         onPressOut={() => {
//           setModalOptions();
//           setPlaylistName('');
//         }}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Pressable
//               style={styles.button}
//               onPress={() => {
//                 setModalOptions();
//                 setModalVisible();
//               }}>
//               <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Rename Playlist</Text>
//             </Pressable>
//             <Pressable
//               style={styles.buttonDelete}
//               onPress={() => {
//                 deletePlaylist.mutate(
//                   {
//                     id: playlistId,
//                     userId: user.id
//                   },
//                   {
//                     onSuccess: () => {
//                       playlists.refetch();
//                       showMessage({
//                         message: 'Playlist deleted successfully',
//                         type: 'success',
//                       });
//                     },
//                     onError: (error) => {
//                       console.error('Error deleting playlist:', error);
//                       showMessage({
//                         message: 'Error deleting playlist',
//                         description: error.response.data.message,
//                         type: 'danger',
//                       });
//                     }
//                   }
//                 );
//                 setModalOptions();
//               }}>
//               <Text style={styles.textStyle}>Delete Playlist</Text>
//             </Pressable>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );
// }

// export default OptionsModal;

import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { styles } from '../style/styles';
import { useModalStore, usePlaylistStore, useShareStore, useUserStore } from '../state/store';
import { usePlaylists } from '../hooks/usePlaylists';
import { useDeletePlaylist } from '../hooks/useDeletePlaylist';
import { showMessage } from 'react-native-flash-message';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSharePlaylist } from '../hooks/useSharePlaylist';

const OptionsModal = () => {

  const user = useUserStore((state) => state.user);
  const modalOptions = useModalStore((state) => state.modalOptions);
  const playlistId = usePlaylistStore((state) => state.playlistId);

  const setModalOptions = useModalStore((state) => state.setModalOptions);
  const setModalVisible = useModalStore((state) => state.setPlaylistNameModal);
  const setPlaylistName = usePlaylistStore((state) => state.setPlaylistName);
  const setShare = useShareStore((state) => state.setShare);

  const playlists = usePlaylists(user.id);
  const deletePlaylist = useDeletePlaylist();

  const handleShare = () => {
    setModalOptions();
    showMessage({
      message: 'Share functionality not implemented yet.',
      type: 'info',
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalOptions}
      onRequestClose={() => {
        setModalOptions();
        setPlaylistName('');
      }}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPressOut={() => {
          setModalOptions();
          setPlaylistName('');
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={modalStyles.modal}>
            <TouchableOpacity
              style={modalStyles.share}
              onPress={() => setShare()}>
              <MaterialCommunityIcons name="share-variant" size={20} color="#fff" />
              <Text style={modalStyles.optionText}>Share Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={modalStyles.rename}
              onPress={() => {
                setModalOptions();
                setModalVisible();
              }}
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
              <Text style={modalStyles.optionText}>Rename Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={modalStyles.delete}
              onPress={() => {
                deletePlaylist.mutate(
                  {
                    id: playlistId,
                    userId: user.id,
                  }, {
                  onSuccess: () => {
                    playlists.refetch();
                    showMessage({
                      message: 'Playlist deleted successfully',
                      type: 'success',
                    });
                  },
                  onError: (error) => {
                    console.error('Error deleting playlist:', error);
                    showMessage({
                      message: 'Error deleting playlist',
                      description: error.response.data.message,
                      type: 'danger',
                    });
                  },
                }
                );
                setModalOptions();
              }}
            >
              <MaterialCommunityIcons name="delete" size={20} color="#fff" />
              <Text style={modalStyles.optionText}>Delete Playlist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default OptionsModal;

const modalStyles = StyleSheet.create({
  modal: {
    backgroundColor: '#24232B',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    alignItems: 'stretch',
    gap: 12,
    elevation: 10,
  },
  share: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A4A',
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  rename: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#44435A',
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  delete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

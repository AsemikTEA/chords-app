import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';
import { styles } from '../style/styles';
import { useCreateVersion } from '../hooks/useCreateVersion';
import { useSongContentStore, useSongVersionStore } from '../state/store';
import { useEditVersion } from '../hooks/useEditSong';

const NewSongHeader = ({ song, onSubmit }) => {

  const pathname = usePathname();
  const metadata = useSongContentStore((state) => state.songMetaData);
  const content = useSongContentStore((state) => state.content);
  const versionId = useSongVersionStore((state) => state.versionId);
  const songId = useSongVersionStore((state) => state.songId);
  
  const editMutation = useEditVersion();

  const goBack = () => {
    router.back();
  }

  return (
    <View style={styles.header}>
      <Pressable
        style={styles.backButton}
        onPress={goBack}
      >
        <Ionicons name="chevron-back" size={28} color="black" />
      </Pressable>
      {pathname === '/create' && (
        <>
          <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 8, paddingLeft: 20 }}>
            <Text style={styles.headerMainTitle}>New Song</Text>
          </View>
          <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Pressable
              style={styles.backButton}
              onPress={onSubmit}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Save</Text>
            </Pressable>
          </View>
        </>
      ) || (
          <>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 8, paddingLeft: 20 }}>
              <Text style={styles.headerMainTitle}>Edit Song</Text>
            </View>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
              <Pressable
                style={styles.backButton}
                onPress={() => { 
                  editMutation.mutate({
                    songId: songId,
                    versionId: versionId,
                    metadata: metadata, 
                    content: content 
                  });
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Save</Text>
              </Pressable>
            </View>
          </>

        )
      }
    </View>
  )
}

export default NewSongHeader;
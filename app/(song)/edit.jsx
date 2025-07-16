import { View, Text, ScrollView, Pressable, Modal, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../../style/styles'
import { useNetworkStore, useOfflineStore, useSongContentStore, useUserStore } from '../../state/store'
import SongContentInput from '../../components/SongContentInput'
import { useSongVersionStore } from '../../state/store';
import { useSongVersion } from '../../hooks/useSongVersion';
import SongBlockTemplate from '../../components/SongBlockTemplate'
import { useNavigation } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useEditVersion } from '../../hooks/useEditSong'
import { SelectList } from 'react-native-dropdown-select-list'
import NewSongHeader from '../../components/NewSongHeader'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { showMessage } from 'react-native-flash-message'
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditSong = () => {

  //const [songVersion, setSongVersion] = useState(null);

  const queryClient = useQueryClient();

  const navigation = useNavigation();

  const songJSON = useOfflineStore((state) => state.songJSON);
  const isConnected = useNetworkStore((state) => state.isConnected);
  const songId = useSongVersionStore((state) => state.songId);
  const versionId = useSongVersionStore((state) => state.versionId);
  const user = useUserStore((state) => state.user);

  const editMutation = useEditVersion();

  let songVersion;

if (isConnected) {
  const data = queryClient.getQueryData(['song-version']);
  songVersion = {data: data};
} else {
  songVersion = {data: songJSON};
}

  const formMethods = useForm({
    defaultValues: {
      version: songVersion.data.version,
      title: songVersion.data.metadata.title,
      artist: songVersion.data.metadata.artist,
      key: songVersion.data.metadata.key,
      capo: songVersion.data.metadata.capo,
      content: songVersion.data.content,
      songId: songId,
      userId: user.id
    }
  });

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
  } = formMethods;

  const verseTemplate = `\n\n{start_of_verse}\n\n{end_of_verse}`;
  const prechorusTemplate = `\n\n{start_of_prechorus}\n\n{end_of_prechorus}`;
  const chorusTemplate = `\n\n{start_of_chorus}\n\n{end_of_chorus}`;
  const bridgeTemplate = `\n\n{start_of_bridge}\n\n{end_of_bridge}`;
  const chordTemplate = `[]`;

  useEffect(() => {
    navigation.setOptions({
      header: () => <NewSongHeader onSubmit={handleSubmit(onSubmit)} />
    });
  }, [navigation]);

  const onSubmit = async (data, e) => {
    if (isConnected) {
      editMutation.mutate({ data });
    } else {
      const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.setItem(`song_${value._id}`, jsonValue);
          console.log('JSON saved successfully:', jsonValue);
          showMessage({
            message: "Success",
            description: "Your stored song was succesfully edited.",
            type: "success",
          });
        } catch (e) {
          console.error('Error saving JSON to AsyncStorage:', e);
          showMessage({
            message: "Error",
            description: e.message,
            type: "danger",
          });
          throw e;
        }
      };

      storeData(data);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView
      //contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={[styles.signContainer, { marginTop: 0 }]}>
          <View style={{ gap: 15, marginBottom: 20 }}>
            <View>
              <Text style={styles.formTextStyle}>Version: {songVersion?.data?.version}</Text>
              <Text style={styles.formTextStyle}>Title: {songVersion?.data?.metadata?.title}</Text>
              <Text style={styles.formTextStyle}>Artist: {songVersion?.data?.metadata?.artist}</Text>
            </View>

            <View>
              <Text style={styles.formTextStyle}>Key</Text>
              <Controller
                control={control}
                name="key"
                rules={{
                  required: "Scale key is required",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.formTextInput}
                    placeholder="Enter key"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      clearErrors('FORM_ERROR');
                    }}
                    value={value}
                  />
                )}
              />
              {errors.key && <Text style={styles.error}>{errors.key.message}</Text>}
            </View>

            <View>
              <Text style={styles.formTextStyle}>Capo</Text>
              <Controller
                control={control}
                name="capo"
                render={({ field: { onChange, onBlur, value } }) => (
                  <SelectList
                    defaultOption={{ key: value, value: value }}
                    setSelected={(value) => onChange(value)}
                    data={[
                      { key: '0', value: 0 },
                      { key: '1', value: 1 },
                      { key: '2', value: 2 },
                      { key: '3', value: 3 },
                      { key: '4', value: 4 },
                      { key: '5', value: 5 },
                      { key: '6', value: 6 },
                      { key: '8', value: 8 },
                      { key: '9', value: 9 },
                      { key: '10', value: 10 },
                      { key: '11', value: 11 },
                      { key: '12', value: 12 },
                      { key: '13', value: 13 },
                      { key: '14', value: 14 },
                      { key: '15', value: 15 },
                    ]}
                    save="value"
                    label={'Capo'}
                  />
                )}
              />
              {errors.capo && <Text style={styles.error}>{errors.capo.message}</Text>}
            </View>

            <View>
              <Text style={styles.formTextStyle}>Content</Text>
              <Controller
                control={control}
                name="content"
                rules={{
                  required: "Content is required",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <SongContentInput
                    handleChangeText={(content) => {
                      onChange(content);
                    }}
                    value={value}
                  />
                )}
              />
              {errors.content && <Text style={styles.error}>{errors.content.message}</Text>}
            </View>

            {errors.FORM_ERROR && (
              <Text style={styles.error}>{errors.FORM_ERROR.message}</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={{ borderWidth: 1, height: 65, width: '100%', alignSelf: 'flex-end', bottom: 0 }}>
        <View style={{ flexDirection: 'row', gap: 5, padding: 5, height: '100%', }}>
          <SongBlockTemplate title={'Verse'} handlePress={() => setValue('content', getValues('content') + verseTemplate)} />
          <SongBlockTemplate title={'Prechorus'} handlePress={() => setValue('content', getValues('content') + prechorusTemplate)} />
          <SongBlockTemplate title={'Chorus'} handlePress={() => setValue('content', getValues('content') + chorusTemplate)} />
          <SongBlockTemplate title={'Bridge'} handlePress={() => setValue('content', getValues('content') + bridgeTemplate)} />
          <SongBlockTemplate title={'Chord'} handlePress={() => setValue('content', getValues('content') + chordTemplate)} />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default EditSong;
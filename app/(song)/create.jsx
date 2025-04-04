import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import { useSongContentStore } from '../../state/store';
import SongContentInput from '../../components/SongContentInput';
import DropdownSelectInput from '../../components/DropdownSelectInput';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import NewSongHeader from '../../components/NewSongHeader';
import { useCreateVersion } from '../../hooks/useCreateVersion';
import SongBlockTemplate from '../../components/SongBlockTemplate';

const CreateSong = () => {

  const navigation = useNavigation();

  const formMethods = useForm({
    defaultValues: {
      title: '',
      artist: '',
      key: '',
      capo: 0,
      content: '',
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

  const createMutation = useCreateVersion();

  useEffect(() => {
    navigation.setOptions({ header: () => <NewSongHeader onSubmit={handleSubmit(onSubmit, onError)} /> });
  }, [navigation]);

  const onSubmit = (data, e) => {
    createMutation.mutate(
      { data },
      { onSuccess: ({ status: status, data: data, response: error }) => console.log(status),
         }
    );

  };
  const onError = (errors, e) => console.log('errors', errors);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView>
        <View style={[styles.signContainer, { marginTop: 0 }]}>
          <View style={{ gap: 15, marginBottom: 20 }}>

            <Text style={styles.formTextStyle}>Title of the song</Text>
            <Controller
              control={control}
              name="title"
              rules={{
                required: "Title is required",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.formTextInput}
                  placeholder="Enter title of the song"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    clearErrors('FORM_ERROR');
                  }}
                  value={value}
                />
              )}
            />
            {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

            <Text style={styles.formTextStyle}>Artist name</Text>
            <Controller
              control={control}
              name="artist"
              rules={{
                required: "Artist name is required",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.formTextInput}
                  placeholder="Enter artist name"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    clearErrors('FORM_ERROR');
                  }}
                  value={value}
                />
              )}
            />
            {errors.artist && <Text style={styles.error}>{errors.artist.message}</Text>}

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

            <Text style={styles.formTextStyle}>Capo</Text>
            <Controller
              control={control}
              name="capo"
              render={({ field: { onChange, onBlur, value } }) => (
                <DropdownSelectInput
                  title={'Capo'}
                  handleChangeText={(value) => {
                    onChange(value);
                  }}
                  value={value}
                />
              )}
            />
            {errors.capo && <Text style={styles.error}>{errors.capo.message}</Text>}

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

            {errors.FORM_ERROR && (
              <Text style={styles.error}>{errors.FORM_ERROR.message}</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={{ borderWidth: 1, height: 65, width: '100%', alignSelf: 'flex-end', bottom: 0 }}>
        <View style={{ flexDirection: 'row', gap: 5, padding: 5, height: '100%', }}>
          <SongBlockTemplate title={'Verse'} handlePress={() => setValue('content', getValues('content') + verseTemplate)}/>
          <SongBlockTemplate title={'Prechorus'} handlePress={() => setValue('content', getValues('content') + prechorusTemplate)}/>
          <SongBlockTemplate title={'Chorus'} handlePress={() => setValue('content', getValues('content') + chorusTemplate)}/>
          <SongBlockTemplate title={'Bridge'} handlePress={() => setValue('content', getValues('content') + bridgeTemplate)}/>
          <SongBlockTemplate title={'Chord'} handlePress={() => setValue('content', getValues('content') + chordTemplate)}/>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CreateSong
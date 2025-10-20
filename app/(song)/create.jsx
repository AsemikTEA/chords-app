import { View, Text, ScrollView, TextInput, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../../style/styles';
import SongContentInput from '../../components/SongContentInput';
import { Controller, useForm, } from 'react-hook-form';
import { useNavigation } from 'expo-router';
import NewSongHeader from '../../components/NewSongHeader';
import { useCreateVersion } from '../../hooks/useCreateVersion';
import SongBlockTemplate from '../../components/SongBlockTemplate';
import { SelectList } from 'react-native-dropdown-select-list';

const CreateSong = () => {

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

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

  const validateData = (text) => {
    const trimmed = text.trim();

    if (text !== trimmed) {
      return 'Text must not start or end with blank spaces.';
    }

    const blockRegex = /\{start_of_[^}]+\}([\s\S]*?)\{end_of_[^}]+\}/g;
    const blocks = [...text.matchAll(blockRegex)];

    if (blocks.length === 0) {
      return 'The song must contain at least one valid block: {start_of_...} ... {end_of_...}.';
    }

    const chordRegex = /\[[^\]]+\]/g;
    const hasChord = chordRegex.test(text);

    if (!hasChord) {
      return 'The song must include at least one chord inside square brackets, e.g. [Am].';
    }

    let nonBlockParts = text;
    for (const match of blocks) {
      nonBlockParts = nonBlockParts.replace(match[0], '');
    }

    if (nonBlockParts.trim() !== '') {
      return 'The song contains text outside of defined blocks.';
    }

    return true;
  };

  const onSubmit = (data, e) => {
    console.log(data);
    createMutation.mutate({ data });
  };
  const onError = (errors, e) => console.log('errors', errors);

  return (
    <>
      <ScrollView
      //contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={[styles.signContainer, { marginTop: 0 }]}>
          <View style={{ gap: 17, marginBottom: 20 }}>

            <View>
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
            </View>

            <View>
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
                  validate: (value) => validateData(value)
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
    </>
  )
}

export default CreateSong
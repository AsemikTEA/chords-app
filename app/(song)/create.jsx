import { View, Text, ScrollView, TextInput, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const onSubmit = (data, e) => {
    console.log(data);
    setModalVisible(true);
    createMutation.mutate(
      { data },
      {
        onSuccess: ({ status: status, data: data, response: error }) => setModalVisible(true),
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
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPressOut={() => {
            setModalVisible(false);
          }}
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 10,
              width: 350,
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              elevation: 30,
            }}>

              <Text style={{ fontSize: 17 }}>Your song has been successfully stored!</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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

export default CreateSong
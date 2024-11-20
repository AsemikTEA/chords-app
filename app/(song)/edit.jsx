import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../../style/styles'
import FormField from '../../components/FormField'
import { useSongContentStore } from '../../state/store'
import SongContentInput from '../../components/SongContentInput'
import DropdownSelectInput from '../../components/DropdownSelectInput'
import { useSongVersionStore } from '../../state/store';
import { useSongVersion } from '../../hooks/useSongVersion';

const EditSong = () => {

  const versionId = useSongVersionStore((state) => state.versionId);
  const songMetaData = useSongContentStore((state) => state.songMetaData);

  const songVersion = useSongVersion(versionId);

  const setTitle = useSongContentStore((state) => state.setTitle);
  const setArtist = useSongContentStore((state) => state.setArtist);
  const setKey = useSongContentStore((state) => state.setKey);
  const setCapo = useSongContentStore((state) => state.setCapo);
  const setVersion = useSongContentStore((state) => state.setVersion);
  const setContent = useSongContentStore((state) => state.setContent);
  const addTemplate = useSongContentStore((state) => state.addTemplate);

  const verseTemplate = `\n\n{start_of_verse}\n\n{end_of_verse}`;
  const prechorusTemplate = `\n\n{start_of_prechorus}\n\n{end_of_prechorus}`;
  const chorusTemplate = `\n\n{start_of_chorus}\n\n{end_of_chorus}`;
  const bridgeTemplate = `\n\n{start_of_bridge}\n\n{end_of_bridge}`;
  const chordTemplate = `[]`;

  useEffect(() => {
    setTitle(songVersion.data.metadata.title);
    setArtist(songVersion.data.metadata.artist);
    setKey(songVersion.data.metadata.key);
    setCapo(songVersion.data.metadata.capo);
    setVersion(songVersion.data.version);
    setContent(songVersion.data.content);
    console.log(songMetaData);
  }, []);

  useEffect(() => {
    console.log(songMetaData);
  }, [songMetaData]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView>
        <View style={[styles.signContainer, { marginTop: 0 }]}>
          <View style={{ gap: 15, marginBottom: 20 }}>
            <View>
              <Text>Version {songMetaData.version}</Text>
              <Text>{songMetaData.title}</Text>
              <Text>{songMetaData.artist}</Text>
            </View>
            <FormField
              title="Key"
              value={songMetaData.key}
              handleChangeText={(e) => { setKey(e) }}
              style={styles.formField}
              placeholder={"Enter musical key of the song"}
            />
            <DropdownSelectInput title={'Capo'}/>
            <SongContentInput/>
          </View>
        </View>
      </ScrollView>
      <View style={{ height: 80, width: '100%', position: 'absolute', alignSelf: 'flex-end', bottom: 0 }}>
        <View style={{ flexDirection: 'row', gap: 5, padding: 5, height: '100%', }}>
          <Pressable
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#24232B' }}
            onPress={() => { addTemplate(verseTemplate) }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Verse</Text>
          </Pressable>
          <Pressable
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#24232B' }}
            onPress={() => { addTemplate(prechorusTemplate) }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Verse</Text>
          </Pressable>
          <Pressable
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#24232B' }}
            onPress={() => { addTemplate(chorusTemplate) }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Verse</Text>
          </Pressable>
          <Pressable
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#24232B' }}
            onPress={() => { addTemplate(bridgeTemplate) }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Verse</Text>
          </Pressable>
          <Pressable
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#24232B' }}
            onPress={() => { addTemplate(chordTemplate) }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Verse</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default EditSong;
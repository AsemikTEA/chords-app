import { View, Text, ScrollView, TextInput, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../../style/styles'
import FormField from '../../components/FormField'
import { useSongContentStore } from '../../state/store'
import SongContentInput from '../../components/SongContentInput'
import DropdownSelectInput from '../../components/DropdownSelectInput'

const CreateSong = () => {

  const setTitle = useSongContentStore((state) => state.setTitle);
  const setArtist = useSongContentStore((state) => state.setArtist);
  const setKey = useSongContentStore((state) => state.setKey);
  const addTemplate = useSongContentStore((state) => state.addTemplate);

  const verseTemplate = `\n\n{start_of_verse}\n\n{end_of_verse}`;
  const prechorusTemplate = `\n\n{start_of_prechorus}\n\n{end_of_prechorus}`;
  const chorusTemplate = `\n\n{start_of_chorus}\n\n{end_of_chorus}`;
  const bridgeTemplate = `\n\n{start_of_bridge}\n\n{end_of_bridge}`;
  const chordTemplate = `[]`;

  let title;
  let artist;
  let key;
  let content;

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView>
        <View style={[styles.signContainer, { marginTop: 0 }]}>
          <View style={{ gap: 15, marginBottom: 20 }}>
            <FormField
              title="Name of the song"
              value={title}
              handleChangeText={(e) => { title = e; setTitle(e); console.log(title) }}
              style={styles.formField}
              placeholder={"Enter name of the song"}
            />
            <FormField
              title="Artist"
              value={artist}
              handleChangeText={(e) => { artist = e; setArtist(e); console.log(artist) }}
              style={styles.formField}
              placeholder={"Enter name of the artist"}
            />
            <FormField
              title="Key"
              value={key}
              handleChangeText={(e) => { key = e; setKey(e); console.log(key) }}
              style={styles.formField}
              placeholder={"Enter musical key of the song"}
            />
            <DropdownSelectInput title={'Capo'}/>
            <SongContentInput text={content} />
          </View>
        </View>
      </ScrollView>
      <View style={{ borderWidth: 1, height: 80, width: '100%', position: 'absolute', alignSelf: 'flex-end', bottom: 0 }}>
        <View style={{ flexDirection: 'row', gap: 5, padding: 5, height: '100%', }}>
          <Pressable
            style={{ borderWidth: 1, flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#24232B' }}
            onPress={() => { addTemplate(verseTemplate) }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Verse</Text>
          </Pressable>
          <Pressable
            style={{ borderWidth: 1, flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#24232B' }}
            onPress={() => { addTemplate(prechorusTemplate) }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Verse</Text>
          </Pressable>
          <Pressable
            style={{ borderWidth: 1, flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#24232B' }}
            onPress={() => { addTemplate(chorusTemplate) }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Verse</Text>
          </Pressable>
          <Pressable
            style={{ borderWidth: 1, flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#24232B' }}
            onPress={() => { addTemplate(bridgeTemplate) }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Verse</Text>
          </Pressable>
          <Pressable
            style={{ borderWidth: 1, flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#24232B' }}
            onPress={() => { addTemplate(chordTemplate) }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Verse</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CreateSong
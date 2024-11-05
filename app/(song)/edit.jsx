import { View, Text, ScrollView, TextInput, Pressable } from 'react-native'
import React, { useEffect, version } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../../style/styles'
import FormField from '../../components/FormField'
import SubmitButton from '../../components/SubmitButton'
import { Link } from 'expo-router'
import { useSongContentStore } from '../../state/store'
import SongContentInput from '../../components/SongContentInput'
import DropdownSelectInput from '../../components/DropdownSelectInput'
import { SelectList } from 'react-native-dropdown-select-list'

const EditSong = () => {

  const song = {
    version: 2,
    metadata: {
      title: 'Perfect',
      artist: 'Ed Sheeran',
      tempo: null,
      key: 'A',
      capo: 2,
      duration: null,
    },
    content: `{start_of_verse: label='Verse 1'}\n I[C] found a love,[A] for me Darli[A]ng, just dive ri[A]ght in and follow [E]my lead. Well, I fo[A]und a girl, beau[Bm]tiful and sweet[A] Oh, I neve[A]r knew you were[F] the someone waiti[A]ng for me\n{end_of_verse}\n\n{start_of_prechorus}\nCa[A]se we were just kids whe[G]n we fell in love Not know[A]ing what it was[D#7]I will not g[A]ive you up this time Bu[A]t darling, just kiss me slow[A] [A]Your he[A]art is all I own[A] And in you[A]r eyes, you're holdi[A]ng mine\n{end_of_prechorus}\n\n{start_of_chorus}\nBaby,[A] I'm dancing in[A] the dark[A] With you between my arms. Bare[A]foot on the gr[A]ass. Liste[A]ning to our[A] favourite song[A]. When y[A]ou said you looked a mess[A] I whispered underneath my breath[A] But you heard i[A]t Darling[A], you look [A]perfect tonight[A]\n{end_of_chorus}\n\n{start_of_verse: label='a'}\nI[A] found a love,[A] for me Darli[A]ng, just dive ri[A]ght in and follow [A]my lead. Well, I fo[A]und a girl, beau[A]tiful and sweet[A] Oh, I neve[A]r knew you were[A] the someone waiti[A]ng for me\n{end_of_verse}`,
    song_id: 'asda'
  }

  const songMetaData = useSongContentStore((state) => state.songMetaData);
  const setTitle = useSongContentStore((state) => state.setTitle);
  const setArtist = useSongContentStore((state) => state.setArtist);
  const setKey = useSongContentStore((state) => state.setKey);
  const setCapo = useSongContentStore((state) => state.setCapo);
  const setContent = useSongContentStore((state) => state.setContent);
  const addTemplate = useSongContentStore((state) => state.addTemplate);

  const verseTemplate = `\n\n{start_of_verse}\n\n{end_of_verse}`;
  const prechorusTemplate = `\n\n{start_of_prechorus}\n\n{end_of_prechorus}`;
  const chorusTemplate = `\n\n{start_of_chorus}\n\n{end_of_chorus}`;
  const bridgeTemplate = `\n\n{start_of_bridge}\n\n{end_of_bridge}`;
  const chordTemplate = `[]`;

  let title = song.metadata.title;
  let artist = song.metadata.artist;
  let key = song.metadata.key;
  let capo = song.metadata.capo;
  let content = song.content;

  useEffect(() => {
    setTitle(song.metadata.title);
    setArtist(song.metadata.artist);
    setKey(song.metadata.key);
    setCapo(song.metadata.capo)
    setContent(song.content);
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
            <FormField
              title="Name of the song"
              value={title}
              handleChangeText={(e) => { title = e; console.log(title) }}
              style={styles.formField}
              placeholder={"Enter name of the song"}
            />
            <FormField
              title="Artist"
              value={artist}
              handleChangeText={(e) => { artist = e; console.log(artist) }}
              style={styles.formField}
              placeholder={"Enter name of the artist"}
            />
            <FormField
              title="Key"
              value={key}
              handleChangeText={(e) => { key = e; console.log(key) }}
              style={styles.formField}
              placeholder={"Enter musical key of the song"}
            />
            <DropdownSelectInput title={'Capo'}/>
            <SongContentInput text={content} />
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
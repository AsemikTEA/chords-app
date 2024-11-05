import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import teoria from 'teoria';
import Interval from 'teoria/lib/interval';
import SongView from '../../components/SongView';
import Transpose from '../../components/Transpose';
import { useTranspositionStore } from '../../state/store';

const DisplaySong = () => {

  const transposition = useTranspositionStore((state) => state.transposition);

  const song = {
    name: 'Afterglow',
    author: 'Ed Sheeran',
    content: "{start_of_verse: label='Verse 1'} I[C] found a love,[A] for me Darli[A]ng, just dive ri[A]ght in and follow [E]my lead. Well, I fo[A]und a girl, beau[Bm]tiful and sweet[A] Oh, I neve[A]r knew you were[F] the someone waiti[A]ng for me{end_of_verse}{start_of_prechorus}Ca[A]se we were just kids whe[G]n we fell in love Not know[A]ing what it was[D#7]I will not g[A]ive you up this time Bu[A]t darling, just kiss me slow[A] [A]Your he[A]art is all I own[A] And in you[A]r eyes, you're holdi[A]ng mine{end_of_prechorus}{start_of_chorus}Baby,[A] I'm dancing in[A] the dark[A] With you between my arms. Bare[A]foot on the gr[A]ass. Liste[A]ning to our[A] favourite song[A]. When y[A]ou said you looked a mess[A] I whispered underneath my breath[A] But you heard i[A]t Darling[A], you look [A]perfect tonight[A]{end_of_chorus}{start_of_verse: label='a'} I[A] found a love,[A] for me Darli[A]ng, just dive ri[A]ght in and follow [A]my lead. Well, I fo[A]und a girl, beau[A]tiful and sweet[A] Oh, I neve[A]r knew you were[A] the someone waiti[A]ng for me{end_of_verse}"
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView>
        <View style={styles2.container}>
          <SongView songContent={song.content} />
        </View>
      </ScrollView>
      {transposition &&
        <Transpose />
      }
    </SafeAreaView>
  );
}

export default DisplaySong;

const styles2 = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1
  },
  lyricLine: {
    flexDirection: 'row',     // Horizontal line for lyrics and chords
    flexWrap: 'wrap',
    borderWidth: 1,
    padding: 3
    // Allow wrapping to new lines
  },
  relativeContainer: {
    position: 'relative',     // Relative container for both chord and lyric
    //marginRight: 5,
    //borderWidth: 1,
    marginTop: 20           // Space between words
  },
  chord: {
    position: 'absolute',     // Position the chord above the lyrics
    top: -20,                 // Adjust this to control how far above the lyrics the chord should be
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    //borderWidth: 1,
  },
  lyrics: {
    fontSize: 16,
    //borderWidth: 1,
  },
});
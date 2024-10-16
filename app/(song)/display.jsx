import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';

const DisplaySong = () => {

  const song = {
    name: 'Afterglow',
    author: 'Ed Sheeran',
    content: "{start_of_verse: label='Verse 1'} I[A] found a love,[A] for me Darli[A]ng, just dive ri[A]ght in and follow [A]my lead. Well, I fo[A]und a girl, beau[A]tiful and sweet[A] Oh, I neve[A]r knew you were[A] the someone waiti[A]ng for me{end_of_verse}{start_of_prechorus}Ca[A]se we were just kids whe[A]n we fell in love Not know[A]ing what it was[A]I will not g[A]ive you up this time Bu[A]t darling, just kiss me slow[A] [A]Your he[A]art is all I own[A] And in you[A]r eyes, you're holdi[A]ng mine{end_of_prechorus}{start_of_chorus}Baby,[A] I'm dancing in[A] the dark[A] With you between my arms. Bare[A]foot on the gr[A]ass. Liste[A]ning to our[A] favourite song[A]. When y[A]ou said you looked a mess[A] I whispered underneath my breath[A] But you heard i[A]t Darling[A], you look [A]perfect tonight[A]{end_of_chorus}"
  }

  const splitSongToBlocks = (lyrics) => {
    const regex =
      /\{(start_of_(verse|chorus|prechorus)(:\s*label='[^']*')?|end_of_(verse|chorus|prechorus))\}/g;
    const regex2 = /start_of/g;
    const regex3 = /end_of/g;
    const regex5 = /label='([^']*)'/g;

    let currentText = [];
    let regexMatchArray;
    let currentIndex = 0;
    let blockName;
    let blockLabel;

    while ((regexMatchArray = regex.exec(lyrics)) !== null) {

      if (regex2.test(regexMatchArray[1])) {
        blockName = regexMatchArray[2];
        console.log('block name: ' + blockName);
      }

      if (regexMatchArray[3]) {
        blockLabel = regex5.exec(regexMatchArray[3])[1];
        console.log('block label: ' + blockLabel);
      }

      const firstBlockIndex = regexMatchArray.index;
      console.log(firstBlockIndex);

      if (firstBlockIndex > currentIndex) {
        const text = lyrics.substring(currentIndex, firstBlockIndex).trim();

        if (text) {
          currentText.push({
            block: blockName,
            label: blockLabel,
            content: text,
          });
        }
      };

      currentIndex = regex.lastIndex;
      if (regex3.test(regexMatchArray[1])) {
        blockLabel = null;
      };
      console.log(currentText);
    }

    for (block of currentText) {
      const parsedSongData = parseChordsAndLyrics(block.content);
      block.content = parsedSongData;
      console.log(block);
    }

    return currentText;
  }

  const parseChordsAndLyrics = (songContent) => {
    const regexChords = /\[([A-G][#b7]?(m|maj7|sus4|add9)?)\]/g;
    let regexMatchArray;
    const chordsAndLyrics = [];
    let currentIndex = 0;

    // loop through every character in provided text
    while ((regexMatchArray = regexChords.exec(songContent)) !== null) {
      const chord = regexMatchArray[1]; // matchArray:[Am],Am,m - match have this structure
      const chordIndex = regexMatchArray.index; // regex match object contains index where match was found https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#return_value
      //console.log('chord: ' + chord)
      //console.log('chordIndex: ' + chordIndex)

      // this adds lyrics before chord to chordsAndLyrics array
      if (chordIndex > currentIndex) {
        const lyricsPart = songContent.substring(currentIndex, chordIndex);

        if (lyricsPart) {
          const words = lyricsPart.split(/(\s+)/); // split text with whitespaces
          chordsAndLyrics.push(...words.map(word => ({
            type: 'lyrics',
            value: word,
          })));
          // console.log(words);
          // console.log(chordsAndLyrics);
        };
      };

      // adds found chord
      chordsAndLyrics.push({
        type: 'chord',
        value: chord
      });

      // console.log(chordsAndLyrics);
      currentIndex = regexChords.lastIndex;
    };

    // adds remaining lyrics after last chord to chordAndLyrics Array
    if (currentIndex < songContent.length) {
      const remainingLyrics = songContent.substring(currentIndex);

      if (remainingLyrics) {
        const words = remainingLyrics.split(/(\s+)/);

        chordsAndLyrics.push(...words.map(word => ({
          type: 'lyrics',
          value: word,
        })));
      };
    };

    return chordsAndLyrics;
  };

  const array = [];

  const SongView = ({ songContent }) => {
    const parsedSongData = splitSongToBlocks(songContent);
    const array = [];

    for (block of parsedSongData) {
      let blockName;

      if (block.label !== null) {
        blockName = block.label;
      } else {
        blockName = block.block;
      };

      array.push(
        <View style={styles.container}>
          <View style={{ borderWidth: 1, marginTop: 10, marginBottom: 5}}>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>{blockName}</Text>
          </View>
          <View style={styles2.lyricLine}>
            {block.content.map((item) => {
              if (item.type === 'chord') {
                return (
                  <Pressable style={styles2.relativeContainer}>
                    <Text style={styles2.chord}>{item.value}</Text>
                  </Pressable>
                );
              } else if (item.type === 'lyrics' && /^\s*[A-Z]/.test(item.value)) {
                return (
                  <View style={styles2.relativeContainer}>
                    <Text style={styles2.lyrics}>{item.value}</Text>
                  </View>
                );
              } else if (item.type === 'lyrics') {
                return (
                  <View style={styles2.relativeContainer}>
                    <Text style={styles2.lyrics}>{item.value}</Text>
                  </View>
                );
              }
            })}
          </View>
        </View>
      )
    }

    return array;
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView>
        <Header song={song} />
        <View style={styles2.container}>
          <SongView songContent={song.content} />
        </View>
      </ScrollView>
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
    // Allow wrapping to new lines
  },
  relativeContainer: {
    //position: 'relative',     // Relative container for both chord and lyric
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
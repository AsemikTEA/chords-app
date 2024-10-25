import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import teoria from 'teoria';
import Interval from 'teoria/lib/interval';
import { useUserStore, useSongStore } from '../state/store';

const DisplaySong = () => {

  // const [ parsedSongData, setParsedSongData ] = useState([]);
  const [ transposeNumber, setTransposeNumber ] = useState(0);

  const songData = useSongStore((state) => state.songData);
  const setSongData = useSongStore((state) => state.setSongData);

  useEffect(() => {
    const data = splitSongToBlocks(song.content);
    console.log(data);
    setSongData(data);
  }, []);

  useEffect(() => {
    transposeChord(parsedSongData, transposeNumber);
  }, [transposeNumber]);

  const song = {
    name: 'Afterglow',
    author: 'Ed Sheeran',
    content: "{start_of_verse: label='Verse 1'} I[A] found a love,[A] for me Darli[A]ng, just dive ri[A]ght in and follow [A]my lead. Well, I fo[A]und a girl, beau[A]tiful and sweet[A] Oh, I neve[A]r knew you were[A] the someone waiti[A]ng for me{end_of_verse}{start_of_prechorus}Ca[A]se we were just kids whe[A]n we fell in love Not know[A]ing what it was[A]I will not g[A]ive you up this time Bu[A]t darling, just kiss me slow[A] [A]Your he[A]art is all I own[A] And in you[A]r eyes, you're holdi[A]ng mine{end_of_prechorus}{start_of_chorus}Baby,[A] I'm dancing in[A] the dark[A] With you between my arms. Bare[A]foot on the gr[A]ass. Liste[A]ning to our[A] favourite song[A]. When y[A]ou said you looked a mess[A] I whispered underneath my breath[A] But you heard i[A]t Darling[A], you look [A]perfect tonight[A]{end_of_chorus}{start_of_verse: label='a'} I[A] found a love,[A] for me Darli[A]ng, just dive ri[A]ght in and follow [A]my lead. Well, I fo[A]und a girl, beau[A]tiful and sweet[A] Oh, I neve[A]r knew you were[A] the someone waiti[A]ng for me{end_of_verse}{start_of_chorus}Baby,[A] I'm dancing in[A] the dark[A] With you between my arms. Bare[A]foot on the gr[A]ass. Liste[A]ning to our[A] favourite song[A]. When y[A]ou said you looked a mess[A] I whispered underneath my breath[A] But you heard i[A]t Darling[A], you look [A]perfect tonight[A]{end_of_chorus}"
  }

  const displayOnlyChords = false;
  //let transposeNumber = 0;

  const intervals = new Map([
    [1, 'm2'], [-1, 'm-2'],
    [2, 'M2'], [-2, 'M-2'],
    [3, 'm3'], [-3, 'm-3'],
    [4, 'M3'], [-4, 'M-3'],
    [5, 'P4'], [-5, 'P-4'],
    [6, 'A4'], [-6, 'A-4'],
    [7, 'P5'], [-7, 'P-5'],
    [8, 'm6'], [-8, 'm-6'],
    [9, 'M6'], [-9, 'M-6'],
    [10, 'm7'], [-10, 'm-7'],
    [11, 'M7'], [-11, 'M-7'],
    [0, 'P1'],
  ]);

  const getIntervalCoord = (transposeNumber) => {
    const interval = intervals.get(transposeNumber);
    const intervalCoord = Interval.toCoord(interval);
    return intervalCoord;
  }

  const transposeChord = (data, transposeNumber) => {
    for (block of data) {
      block.content.forEach(element => {
        if (element.type === 'chord') {
          element.transposeValue = element.value.interval(getIntervalCoord(transposeNumber)).name;
        };
      });
      //console.log(block.content);
    }
    //console.log(data[0].content);
    //setParsedSongData(data);
    //console.log(parsedSongData);
  }

  const splitSongToBlocks = (lyrics) => {
    const regex =
      /\{(start_of_(verse|chorus|prechorus)(:\s*label='[^']*')?|end_of_(verse|chorus|prechorus))\}/g;
    const regex2 = /start_of/g;

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

      const firstBlockIndex = regexMatchArray.index;
      console.log(firstBlockIndex);

      if (firstBlockIndex > currentIndex) {
        const text = lyrics.substring(currentIndex, firstBlockIndex).trim();

        if (text) {
          currentText.push({
            block: blockName,
            content: text,
          });
        }
      };

      currentIndex = regex.lastIndex;

      //console.log(currentText);
    }

    for (block of currentText) {
      const parsedSongData = parseChordsAndLyrics(block.content);
      block.content = parsedSongData;
      //console.log(block.content);
    }

    // console.log(currentText);
    // setParsedSongData(parsedSongData => ({...parsedSongData, ...currentText}));
    return currentText;
  }

  const parseChordsAndLyrics = (songContent) => {
    const regexChords = /\[([A-G][#b7]?(m|maj7|sus4|add9)?)\]/g;
    let regexMatchArray;
    const chordsAndLyrics = [];
    let currentIndex = 0;

    // loop through every character in provided text
    while ((regexMatchArray = regexChords.exec(songContent)) !== null) {
      const chord = teoria.chord(regexMatchArray[1]); // matchArray:[Am],Am,m - match have this structure
      const chordIndex = regexMatchArray.index; // regex match object contains index where match was found https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#return_value
      //console.log('chord: ' + chord)
      //console.log('chordIndex: ' + chordIndex)

      // this adds lyrics before chord to chordsAndLyrics array
      if (chordIndex > currentIndex) {
        const lyricsPart = songContent.substring(currentIndex, chordIndex);

        chordsAndLyrics.push({
          type: 'lyrics',
          value: lyricsPart 
        });
        // if (lyricsPart) {
        //   const words = lyricsPart.split(/(\s+)/); // split text with whitespaces
        //   chordsAndLyrics.push(...words.map(word => ({
        //     type: 'lyrics',
        //     value: word,
        //   })));
        //   // console.log(words);
        //   // console.log(chordsAndLyrics);
        // };
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

      chordsAndLyrics.push({
        type: 'lyrics',
        value: remainingLyrics 
      });
      // if (remainingLyrics) {
      //   const words = remainingLyrics.split(/(\s+)/);

      //   chordsAndLyrics.push(...words.map(word => ({
      //     type: 'lyrics',
      //     value: word,
      //   })));
      // };
    };

    return chordsAndLyrics;
  };

  let parsedSongData;
  //console.log(songData);
  

  const SongView = ({ songContent }) => {
    parsedSongData = splitSongToBlocks(songContent);
    let array;

    if (displayOnlyChords) {
      array = [];

      for (block of songData) {
        const blockName = block.block

        array.push(
          <View style={styles.container}>
            <View style={{ marginTop: 2, flexDirection: 'row' }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold', marginRight: 8 }}>{blockName}:</Text>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                {block.content.map((item) => {
                  if (item.type === 'chord') {
                    return (
                      <Pressable style={{ marginRight: 7 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{item.value.name}</Text>
                      </Pressable>
                    );
                  };
                })}
              </View>
            </View>
          </View>
        )
      }
    } else {
      array = [];

      for (block of songData) {
        const blockName = block.block

        array.push(
          <View style={styles.container}>
            <View style={{ borderWidth: 1, marginTop: 10, marginBottom: 5 }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{blockName}</Text>
            </View>
            <View style={styles2.lyricLine}>
              {block.content.map((item) => {
                if (item.type === 'chord') {
                  return (
                    <Pressable style={styles2.relativeContainer}>
                      <Text style={styles2.chord}>{item.value.name}</Text>
                    </Pressable>
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
    }
    
    //console.log(parsedSongData);
    return array;
  }

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
      <View style={{ borderWidth: 1, height: 50 }}>
        <View style={{ flexDirection: 'row' }}>
          <Pressable
            style={{ borderWidth: 1, flex: 1, }}
            onPress={() => {
              setTransposeNumber(transposeNumber + 1); 
              console.log(transposeNumber);
              transposeChord(parsedSongData, transposeNumber);
            }}
          >
            <Text>Nahoru</Text>
          </Pressable>
          <View>
            <Text>{transposeNumber}</Text>
          </View>
          <Pressable
            style={{ borderWidth: 1, flex: 1, }}
            onPress={() => {
              setTransposeNumber(transposeNumber - 1);
              console.log(transposeNumber);
              transposeChord(parsedSongData, transposeNumber);
            }}
          >
            <Text>Dolu</Text>
          </Pressable>
        </View>
      </View>
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
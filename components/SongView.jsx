import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import teoria from 'teoria';
import Interval from 'teoria/lib/interval';
import { styles } from '../style/styles'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChordsStore, useTranspositionNumberStore } from '../state/store';

const SongView = ({ songContent }) => {

  let parsedSongData;
  const displayOnlyChords = false;
  let chordsArray = [];
  let chordsToDisplay = [];
  let array;
  let chordIndex = 0;
  let blockIndex = -1;
  let transposeChordArray = [];

  const chords = useChordsStore((state) => state.chords);
  const addChords = useChordsStore((state) => state.addChords);
  const transposedChords = useChordsStore((state) => state.transposedChords);
  const transpositionNumber = useTranspositionNumberStore((state) => state.transpositionNumber);
  const resetTransposedChords = useChordsStore((state) => state.resetTransposedChords);
  const addTransposedChords = useChordsStore((state) => state.addTransposedChords);

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

  useEffect(() => {
    for (block of chordsArray) {
      const c = [];

      block.chords.map((item) => {
        c.push(item.name);
      });
      console.log(c);
      addTransposedChords({
        block: block.block,
        chords: c,
      })
    }
  }, [])

  useEffect(() => {
    transposeChord(chordsArray, transpositionNumber);
    console.log(transposedChords)
  }, [transpositionNumber]);

  const getIntervalCoord = (transpositionNumber) => {
    const interval = intervals.get(transpositionNumber);
    const intervalCoord = Interval.toCoord(interval);
    return intervalCoord;
  }

  const transposeChord = (chordsArray, transpositionNumber) => {

    chordsToDisplay = [];
    resetTransposedChords();

    for (block of chordsArray) {
      const transChords = [];

      block.chords.map((item, index) => {
        const transposedChord = item.interval(getIntervalCoord(transpositionNumber));
        //console.log('TRANSPOSE ARRAY: ' + transposedChord);
        transChords.push(transposedChord.name);
        //addTransposedChords(transposedChord.name);
      });
      addTransposedChords({
        block: block.block,
        chords: transChords
      });
    }
  }

  const splitSongToBlocks = (songContent) => {
    const regex =
      /\{(start_of_(verse|chorus|prechorus)(:\s*label='[^']*')?|end_of_(verse|chorus|prechorus))\}/g;
    const regex2 = /start_of/g;

    let currentText = [];
    let regexMatchArray;
    let currentIndex = 0;
    let blockName;

    while ((regexMatchArray = regex.exec(songContent)) !== null) {

      if (regex2.test(regexMatchArray[1])) {
        blockName = regexMatchArray[2];
        console.log('block name: ' + blockName);
      }

      const firstBlockIndex = regexMatchArray.index;
      console.log(firstBlockIndex);

      if (firstBlockIndex > currentIndex) {
        const text = songContent.substring(currentIndex, firstBlockIndex).trim();
        const { chords, lyrics } = parseChordsAndLyrics(text);
        //console.log(lyrics);
        //console.log(chords);
        if (text) {
          currentText.push({
            block: blockName,
            lyrics: lyrics,
            //chords: chords
          });
          chordsArray.push({
            block: blockName,
            chords: chords,
          });
        }
        console.log(chordsArray);
      };

      currentIndex = regex.lastIndex;
      //console.log(currentText);
    }

    return currentText;
  }

  const parseChordsAndLyrics = (text) => {
    const regex = /\[([A-G][#b]?(m|maj7|sus4|add9|7)?)\]/g; // Match chords inside []
    let match;
    const lyrics = [];
    const chords = [];
    let currentIndex = 0;
    let lastLyricIndex = null;

    while ((match = regex.exec(text)) !== null) {
      console.log(match);
      const chord = teoria.chord(match[1], match[2]);
      const chordIndex = match.index;

      // Extract lyrics before the chord
      if (chordIndex > currentIndex) {
        const lyricsPart = text.substring(currentIndex, chordIndex);
        if (lyricsPart) {
          const words = lyricsPart.split(/(\s+)/);
          words.forEach((word) => {
            const lyricObject = {
              type: 'lyrics',
              value: word,
              isFollowedByChord: false,
            };
            lyrics.push(lyricObject);
          });
        }
        lastLyricIndex = lyrics.length - 1;
      }

      // Add the chord to the chords array and mark the previous lyric to be followed by a chord
      if (lastLyricIndex !== null) {
        lyrics[lastLyricIndex].isFollowedByChord = true;
      }
      chords.push(chord);

      currentIndex = regex.lastIndex;
    }

    // Add any remaining lyrics after the last chord
    if (currentIndex < text.length) {
      const remainingLyrics = text.substring(currentIndex).trim();
      if (remainingLyrics) {
        const words = remainingLyrics.split(/(\s+)/);
        words.forEach((word) => {
          lyrics.push({ type: 'lyrics', value: word, isFollowedByChord: false });
        });
      }
    }

    return { chords, lyrics };
  };

  parsedSongData = splitSongToBlocks(songContent);

  if (displayOnlyChords) {
    array = [];

    for (block of parsedSongData) {
      const blockName = block.block;
      chordIndex = 0;
      blockIndex++;

      array.push(
        <View style={styles.container}>
          <View style={{ marginTop: 10, marginBottom: 5 }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{blockName}</Text>
          </View>
          <View style={styles2.lyricLine}>
            {/* Render starting chords if they exist */}
            {chordsArray[0].chords.length && !block.lyrics[0]?.isFollowedByChord && (
              <Pressable style={styles2.relativeContainer}>
                <Text style={styles2.chord}>{chordsArray[0].chords[chordIndex++].name}</Text>
              </Pressable>
            )}

            {/* Render lyrics and chordsArray */}
            {block.lyrics.map((item, index) => {
              if (item.isFollowedByChord && chordIndex < chordsArray[blockIndex].chords.length) {
                return (
                  <>
                    <Text key={index} style={styles2.relativeContainer}>
                      {item.value}
                    </Text>
                    <Pressable style={styles2.relativeContainer}>
                      <Text style={styles2.chord}>{chordsArray[blockIndex].chords[chordIndex++].name}</Text>
                    </Pressable>
                  </>
                );
              } else {
                return (
                  <Text key={index} style={styles2.relativeContainer}>
                    {item.value}
                  </Text>
                );
              }
            })}
          </View>
        </View>
      )
    }
  } else {
    array = [];

    for (block of transposedChords) {
      const blockName = block.block
      console.log(transposedChords)

      array.push(
        <View style={styles.container}>
          <View style={{ marginTop: 2, flexDirection: 'row',}}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', marginRight: 8 }}>{blockName}:</Text>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
              {block.chords.map((item) => {

                return (
                  <Pressable style={{ marginRight: 7 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{item}</Text>
                  </Pressable>
                );

              })}
            </View>
          </View>
        </View>
      )
    }
  }

  return array;
};

export default SongView

const styles2 = StyleSheet.create({
  container: {
    padding: 10,
    //borderWidth: 1
  },
  lyricLine: {
    flexDirection: 'row',     // Horizontal line for lyrics and chordsArray
    flexWrap: 'wrap',
    //borderWidth: 1,
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
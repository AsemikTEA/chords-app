import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import teoria from 'teoria';
import Interval from 'teoria/lib/interval';
import { styles } from '../style/styles'
import { useDisplayModeStore, useTranspositionNumberStore } from '../state/store';
import { usePathname } from 'expo-router';

const SongViewPlaylist = ({ song, index }) => {

  const displayOnlyChords = useDisplayModeStore((state) => state.displayOnlyChords);
  const transpositionArray = useTranspositionNumberStore((state) => state.transpositionArray);

  const hasMounted = useRef(false);
  const [transposedChords, setTransposedChords] = useState([]);

  let array;

  const chordsArray = useRef([]);
  const parsedSongData = useRef([]);
  const blockIndex = useRef(-1);
  const chordIndex = useRef(0);

  const pathname = usePathname();

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
    //console.log('prvni useEffect jde!');
    console.log(transpositionArray);
    chordsArray.current = [];
    blockIndex.current = -1;
    chordIndex.current = 0;

    const parsed = splitSongToBlocks(song.content);
    parsedSongData.current = parsed;

    // const transposed = chordsArray.current.map((block) => {
    //   const c = [];
    //   //console.log("block name: " + block.block);

    //   block.chords.map((item) => {
    //     c.push(item.name);
    //   });

    //   return {
    //     block: block.block,
    //     chords: c,
    //   };
    // });

    transposeChord(chordsArray.current, transpositionArray[index] || 0);
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      // Skip the first render
      hasMounted.current = true;
      return;
    }
    console.log('TRANSPOSITION ARRAY CHANGED: ', transpositionArray);

    transposeChord(chordsArray.current, transpositionArray[index]);
  }, [transpositionArray[index]]);

  const getIntervalCoord = (transpositionNumber) => {
    const interval = intervals.get(transpositionNumber);
    const intervalCoord = Interval.toCoord(interval);
    return intervalCoord;
  }

  const transposeChord = (chordsArray, transpositionNumber) => {

    setTransposedChords([]);

    const transposed = chordsArray.map((block) => {
      const transChords = [];
      console.log("block name in transposeChord: " + block.block);

      block.chords.map((item) => {
        const transposedChord = item.interval(getIntervalCoord(transpositionNumber));
        transChords.push(transposedChord.name);
      });

      return {
        block: block.block,
        chords: transChords,
      };
    });

    setTransposedChords(transposed);
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
        //console.log('block name: ' + blockName);
      }

      const firstBlockIndex = regexMatchArray.index;
      //console.log(firstBlockIndex);

      if (firstBlockIndex > currentIndex) {
        const text = songContent.substring(currentIndex, firstBlockIndex).trim();
        const { chords, lyrics } = parseChordsAndLyrics(text);
        if (text) {
          currentText.push({
            block: blockName,
            lyrics: lyrics,
          });
          chordsArray.current.push({
            block: blockName,
            chords: chords,
          });
        }
        //console.log(chordsArray.current);
      };

      currentIndex = regex.lastIndex;
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
      //console.log(match);
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

  //parsedSongData = splitSongToBlocks(song.content);
  if (!parsedSongData.current.length) return <Text>Loading...</Text>

  if (!transposedChords || transposedChords.length === 0) {
    return <Text>Loading chords...</Text>;
  }

  blockIndex.current = -1;
  chordIndex.current = 0;

  if (displayOnlyChords) {
    array = [];

    if (pathname === '/display-playlist') {
      array.push(
        <View style={{ marginTop: 10, marginBottom: 5 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{song.metadata.title}</Text>
        </View>
      )
    }

    for (block of transposedChords) {
      const blockName = block.block

      array.push(
        <View style={styles.container}>
          <View style={{ marginTop: 2, flexDirection: 'row', }}>
            <Text style={{ fontSize: 17, marginRight: 8 }}>{blockName}:</Text>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
              {block.chords.map((item, index) => {

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
  } else {
    array = [];

    if (pathname === '/display-playlist') {
      array.push(
        <View style={{ marginTop: 10, marginBottom: 5 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{song.metadata.title}</Text>
        </View>
      )
    }

    for (block of parsedSongData.current) {
      const blockName = block.block;

      chordIndex.current = 0;
      blockIndex.current++;

      if (!transposedChords[blockIndex.current]) return null;

      array.push(
        <View style={styles.container}>
          <View style={{ marginTop: 10, marginBottom: 5 }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{blockName}</Text>
          </View>
          <View style={styles2.lyricLine}>
            {/* Render starting chords if they exist */}
            {transposedChords[0].chords.length && !block.lyrics[0]?.isFollowedByChord && (
              <Pressable style={styles2.relativeContainer}>
                <Text style={styles2.chord}>{transposedChords[0].chords[chordIndex.current++]}</Text>
              </Pressable>
            )}

            {/* Render lyrics and chordsArray */}
            {block.lyrics.map((item, index) => {
              if (item.isFollowedByChord && chordIndex.current < transposedChords[blockIndex.current].chords.length) {
                return (
                  <>
                    <Text key={index} style={styles2.relativeContainer}>
                      {item.value}
                    </Text>
                    <Pressable style={styles2.relativeContainer} key={'chord' + chordIndex.current}>
                      <Text style={styles2.chord}>{transposedChords[blockIndex.current].chords[chordIndex.current++]}</Text>
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
  }

  return array;
};

export default SongViewPlaylist;

const styles2 = StyleSheet.create({
  container: {
    padding: 10,
    //borderWidth: 1
  },
  lyricLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //borderWidth: 1,
    padding: 3
  },
  relativeContainer: {
    position: 'relative',
    //marginRight: 5,
    //borderWidth: 1,
    marginTop: 20
  },
  chord: {
    position: 'absolute',
    top: -20,
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
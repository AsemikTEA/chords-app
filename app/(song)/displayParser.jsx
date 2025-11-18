import { View, Text, ScrollView, } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { styles } from '../../style/styles';
import SongView from '../../components/SongView';
import Transpose from '../../components/Transpose';
import { useAutoscrollStore, useDisplayModeStore, useSongVersionStore, useTranspositionStore, } from '../../state/store';
import { useSongVersion } from '../../hooks/useSongVersion';
import AddToPlaylistModal from '../../components/AddToPlaylistModal';
import { useNavigation } from 'expo-router';
import Header from '../../components/Header';
import AutoscrollSpeed from '../../components/AutoscrollSpeed';
import ChordSheetJS, { Song, Chord } from 'chordsheetjs';
import { use } from 'react';
import { set } from 'react-hook-form';
import ChordLyricsLine from '../../components/ChordLyricsLine';

const displayParser = () => {

  const [formattedSong, setFormattedSong] = useState(null);
  const [songParagraphs, setSongParagraphs] = useState(null);
  const [song, setSong] = useState(null);
  const [transposedChords, setTransposedChords] = useState([]);

  const parser = new ChordSheetJS.ChordProParser();
  const formatter = new ChordSheetJS.TextFormatter();

  const versionId = useSongVersionStore((state) => state.versionId);

  const version = useSongVersion(versionId);

  //const formattedSong = useRef(null);

  useEffect(() => {
    const song = parser.parse(version.data?.content ?? '');
    console.log('Parsed song:', song.lines[3]);
    const formattedSong = formatter.format(song);
    //console.log('Formatted song:\n', formattedSong);

    const songParagraphs = song.bodyParagraphs;
    const songLines1 = songParagraphs[2]?.lines[0]?.items;
    const songLines2 = songParagraphs[2]?.lines;
    const songLines3 = songParagraphs[0];

    const chord = Chord.parse('F#maj7');

    const transposedChord = chord.transposeDown();

    const chord2 = transposedChord.toString();

    //console.log('Soong chords: ', song.getChords());
    //console.log(JSON.stringify(songLines1, null, 2));
    //console.log('Song lines 2: ', JSON.stringify(songLines2, null, 2));
    console.log('Song lines 3: ', JSON.stringify(songLines3, null, 2));
    console.log('Song paragraphs: ', songParagraphs);
    console.log('CHORD: ', chord);
    console.log('TRANSPOSE CHORD: ', transposedChord);
    console.log('CHORD 2: ', chord2);

setSong(song);
    setSongParagraphs(songParagraphs);
    setFormattedSong(formattedSong);
  }, [version.data]);

  return (
    <View>
      <ScrollView style={{ padding: 16 }}>
      {song?.lines.map((line, idx) =>
        line.items && line.items.length > 0 ? (
          <ChordLyricsLine key={idx} items={line.items} />
        ) : null
      )}
    </ScrollView>
    </View>
  )
}

export default displayParser
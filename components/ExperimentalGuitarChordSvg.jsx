"use dom";

import React from 'react';
import chords from '@tombatossals/chords-db/lib/guitar.json';
import Chord from '@tombatossals/react-chords/lib/Chord';
import { renderToStaticMarkup } from 'react-dom/server';

export default function GuitarChordSvg({ chordName }) {
  const chordParts = chordName.match(/([A-G][#b]?)(.*)/).slice(1);
  let [key, suffix] = chordParts;

  switch (key) {
    case 'Db':
      key = 'C#'; // Normalize Db to C#
      break;
    case 'D#':
      key = 'Eb'; // Normalize D# to Eb
      break;
    case 'Gb':
      key = 'F#'; // Normalize Gb to F#
      break;
    case 'G#':
      key = 'Ab'; // Normalize G# to Ab
      break;
    case 'A#':
      key = 'Bb'; // Normalize A# to Bb
      break;
    default:
      break; // No normalization needed for other keys
  }

  // Normalize suffix
  if (suffix === 'm') suffix = 'minor';
  if (!suffix) suffix = 'major';

  const chordVariants = chords.chords[key];
  if (!chordVariants) {
    console.warn(`Chord root not found: ${key}`);
    return null;
  }

  const chordData = chordVariants.find(variant => variant.suffix === suffix);
  if (!chordData) {
    console.warn(`Chord suffix not found: ${suffix} for ${key}`);
    return null;
  }

  const position = chordData.positions[0];

  const chordInfo = {
    frets: position.frets,
    fingers: position.fingers,
    barres: position.barres || [],
    capo: position.capo || false,
  };

  const instrument = {
    strings: 6,
    fretsOnChord: 4,
    name: 'Guitar',
    tunings: {
      standard: ['E', 'A', 'D', 'G', 'B', 'E']
    }
  };


  const svg = renderToStaticMarkup(
    <Chord
      chord={chordInfo}
      instrument={instrument}
    />
  );

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
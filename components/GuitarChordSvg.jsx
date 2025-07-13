import React from 'react';
import chords from '@tombatossals/chords-db/lib/guitar.json';
import Chord from '@tombatossals/react-chords/lib/Chord';
import { renderToStaticMarkup } from 'react-dom/server';
import { SvgCss } from 'react-native-svg/css';

const getChordSvgXml = (chordName) => {
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

  const svgString = renderToStaticMarkup(
    Chord({
      chord: chordInfo,
      instrument: instrument,
    })
  );

  // Replace rem values for compatibility with React Native SVG
  return svgString
    .replaceAll('0.7rem', '11px')
    .replaceAll('0.3rem', '5px')
    .replaceAll('0.25rem', '4px');
};

const GuitarChordSvg = ({ chordName, width = 300, height = 300 }) => {
  const svgXml = getChordSvgXml(chordName);

  if (!svgXml) {
    return <></>; // optionally return fallback (e.g. "Akord nenalezen")
  }

  return <SvgCss xml={svgXml} width={width} height={height} />;
};

export default GuitarChordSvg;
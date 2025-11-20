
import React, { use } from 'react';
import chords from '@tombatossals/chords-db/lib/guitar.json';
import Chord from '@tombatossals/react-chords/lib/Chord';
import { renderToStaticMarkup } from 'react-dom/server';
import { SvgCss } from 'react-native-svg/css';
import Svg, { Circle, Rect, Line } from 'react-native-svg';
import { Text, View } from 'react-native';

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

  console.log('Generating SVG for chord:', chordName, chordInfo);

  const chord = <Chord
    chord={chordInfo}
    instrument={instrument}
    lite={true}
  />;

  const testSVG = () =>
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="10"
      y="10"
      width="180"
      height="180"
      stroke="black"
      stroke-width="2"
      fill="none"
    />
    <circle
      cx="100"
      cy="100"
      r="50"
      fill="green"
    />
    <line
      x1="0"
      y1="0"
      x2="200"
      y2="200"
      stroke="blue"
      stroke-width="3"
    />
  </svg>
  

  console.log('Chord component created:', chord);

  try {
    const svgString = renderToStaticMarkup(

      chord
    );
    console.log('Chord component created:', svgString);
    return svgString
      .replaceAll('0.7rem', '11px')
      .replaceAll('0.3rem', '5px')
      .replaceAll('0.25rem', '4px');
  } catch (error) {
    console.error('Error generating chord SVG:', error);
    return null;
  }

  console.log('Chord component created:', chord);
  const svgString = renderToStaticMarkup(
    chord
    // <Chord
    //   chord={chordInfo}
    //   instrument={instrument}
    //   lite={true}
    // />
  );

  console.log('Generated SVG String:', svgString);

  return svgString
    .replaceAll('0.7rem', '11px')
    .replaceAll('0.3rem', '5px')
    .replaceAll('0.25rem', '4px');
};

const GuitarChordSvg = ({ chordName, width = 300, height = 300 }) => {
  console.log('Rendering GuitarChordSvg for:', chordName);
  const svgXml = getChordSvgXml(chordName);

  if (!svgXml) {
    return <>
      <View style={{ flex: 1 }}>
        <Text>Chord not found: {chordName}</Text>
      </View>
    </>;
  }

  return <SvgCss xml={svgXml} width={width} height={height} />;
};

export default GuitarChordSvg;
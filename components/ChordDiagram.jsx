import { View } from "react-native";
import Svg, { G, Line, Circle, Rect, Text } from "react-native-svg";

const ChordDiagram = ({
  chord,
  instrument,
  width = 180,
  height = 240,
  padding = 14,
  topArea = 26,
  bottomArea = 26,
  tunings = tunings || ["E", "A", "D", "G", "B", "E"]
}) => {
  const strings = instrument.strings;
  const fretsOnChord = instrument.fretsOnChord;

  // base fret shift (simple)
  const pressedFrets = chord.frets.filter((f) => typeof f === "number" && f > 0);
  const minPressed = pressedFrets.length ? Math.min(...pressedFrets) : 1;
  const maxPressed = pressedFrets.length ? Math.max(...pressedFrets) : 1;

  const needsShift = maxPressed > fretsOnChord;
  const baseFret = needsShift ? minPressed : 1;

  const gridLeft = padding;
  const gridTop = padding + topArea;
  const gridWidth = width - padding * 2;
  const gridHeight = height - gridTop - padding - bottomArea;

  const stringGap = strings > 1 ? gridWidth / (strings - 1) : 0;
  const fretGap = gridHeight / fretsOnChord;

  const xForString = (sIndex) => gridLeft + sIndex * stringGap;
  const yForFret = (fretIndex1Based) => gridTop + (fretIndex1Based - 0.5) * fretGap;

  const dotRadius = Math.min(stringGap || 999, fretGap) * 0.37;
  const dotDiameter = dotRadius * 2;
  const barreHeight = dotRadius * 1.35;

  const renderTopMarks = () =>
    chord.frets.map((f, i) => {
      const x = xForString(i);
      const y = padding + 16;

      if (f === -1) {
        return (
          <Text key={`mute-${i}`} x={x} y={y} fontSize={12} textAnchor="middle">
            X
          </Text>
        );
      }
      if (f === 0) {
        return (
          <Text key={`open-${i}`} x={x} y={y} fontSize={12} textAnchor="middle">
            O
          </Text>
        );
      }
      return null;
    });

  const renderGrid = () => {
    const nodes = [];

    // Strings (vertical)
    for (let s = 0; s < strings; s++) {
      nodes.push(
        <Line
          key={`string-${s}`}
          x1={xForString(s)}
          y1={gridTop}
          x2={xForString(s)}
          y2={gridTop + gridHeight}
          stroke="black"
          strokeWidth={1}
        />
      );
    }

    // Frets (horizontal) incl top line
    for (let f = 0; f <= fretsOnChord; f++) {
      const y = gridTop + f * fretGap;
      const isNut = baseFret === 1 && f === 0;

      nodes.push(
        <Line
          key={`fret-${f}`}
          x1={gridLeft}
          y1={y}
          x2={gridLeft + gridWidth}
          y2={y}
          stroke="black"
          strokeWidth={isNut ? 7 : 1}
          strokeLinecap="round"
        />
      );
    }

    return nodes;
  };

  const renderDots = () =>
    chord.frets.map((f, stringIndex) => {
      if (f <= 0) return null;

      const relativeFret = f - baseFret + 1;
      if (relativeFret < 1 || relativeFret > fretsOnChord) return null;

      const cx = xForString(stringIndex);
      const cy = yForFret(relativeFret);
      const finger = chord.fingers?.[stringIndex];

      return (
        <G key={`dot-${stringIndex}`}>
          <Circle cx={cx} cy={cy} r={dotRadius} fill="black" />
          {finger ? (
            <Text
              x={cx}
              y={cy + dotRadius * 0.45}
              fontSize={dotRadius * 1.2}
              fill="white"
              textAnchor="middle"
            >
              {String(finger)}
            </Text>
          ) : null}
        </G>
      );
    });

  const renderBarres = () => {
    if (!chord.barres?.length) return null;

    return chord.barres.map((barreFret, idx) => {

      const barreStrings = chord.frets
        .map((f, i) => ({ i, f }))
        .filter((x) => x.f === barreFret)
        .map((x) => x.i);

      if (barreStrings.length < 2) return null;

      const first = barreStrings[0];
      const last = barreStrings[barreStrings.length - 1];

      const relativeFret = barreFret - baseFret + 1;
      if (relativeFret < 1 || relativeFret > fretsOnChord) return null;

      const y = yForFret(relativeFret) - dotDiameter / 2;

      const xLeft = xForString(first);
      const xRight = xForString(last);
      const w = xRight - xLeft;

      const overshoot = dotRadius * 1;

      return (
        <Rect
          key={`barre-${idx}`}
          x={xLeft - overshoot}
          y={y}
          width={w + overshoot * 2}
          height={dotDiameter}
          rx={dotDiameter / 2}
          ry={dotDiameter / 2}
          fill="black"
        />
      );
    });
  };

  const renderTunings = () => {

    const y = gridTop + gridHeight + 22;
    return new Array(strings).fill(null).map((_, i) => (
      <Text
        key={`tuning-${i}`}
        x={xForString(i)}
        y={y}
        fontSize={16}
        fontWeight="600"
        textAnchor="middle"
        fill='#333'
      >
        {tunings[i] ?? ""}
      </Text>
    ));
  };

  const renderBaseFretLabel = () => {
    if (baseFret <= 1) return null;
    return (
      <Text x={gridLeft - 6} y={gridTop + fretGap * 0.7} fontSize={12} textAnchor="end">
        {String(baseFret)}
      </Text>
    );
  };

  return (
    <View>
      <Svg width={width} height={height}>
        {renderTopMarks()}
        {renderGrid()}
        {renderBaseFretLabel()}
        {renderBarres()}
        {renderDots()}
        {renderTunings()}
      </Svg>
    </View>
  );
}

export default ChordDiagram;
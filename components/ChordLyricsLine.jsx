import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const ChordLyricsLine = ({ items }) => {
  const [widths, setWidths] = useState({});

  const handleLayout = (index, event) => {
    const { width } = event.nativeEvent.layout;
    setWidths(prev => ({ ...prev, [index]: width }));
  };

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16 }}>
      <View style={styles2.lyricLine}>
        {items.map((item, index) => {
          if (item.chords && item.lyrics) {
            return (
              <>
                <Text style={styles2.relativeContainer}>{item.lyrics}</Text>
                <Pressable style={styles2.relativeContainer}>
                  <Text style={styles2.chord}>{item.chords}</Text>
                </Pressable>
              </>
            );
          } else if (item.lyrics && !item.chords) {
            return (
              <View style={styles2.relativeContainer}>
                <Text style={styles2.lyrics}>{item.lyrics}</Text>
              </View>
            )
          } else {
            <Pressable style={styles2.relativeContainer}>
              <Text style={styles2.chord}>{item.chords}</Text>
            </Pressable>
          }
          {/* Akord (vykreslíme ho jen pokud známe šířku textu pod ním) */ }
          // {
          //   item.chords && item.lyrics && (
          //     <>
          //       <Text style={styles2.relativeContainer}>
          //         {item.lyrics}
          //       </Text>
          //       <Pressable style={styles2.relativeContainer}>
          //         <Text style={styles2.chord}>{item.chords}</Text>
          //       </Pressable>
          //     </>
          //   )
          // }
          // {
          //   item.lyrics && !item.chords && (
          //     <Text style={styles2.relativeContainer} onLayout={(event) => handleLayout(index, event)}>
          //       {item.lyrics}
          //     </Text>
          //   )
          // }
          // {/* Text s měřením */ }
          // <Text
          //   style={styles2.relativeContainer}
          // >
          //   {item.lyrics}
          // </Text>
          // </View>
        })}
      </View>
    </View >
  );
};

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

export default ChordLyricsLine;
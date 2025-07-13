import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useTranspositionNumberStore } from '../state/store';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const TranspositionTab = ({ title }) => {

  const transpositionArray = useTranspositionNumberStore((state) => state.transpositionArray);
  const activeSongIndex = useTranspositionNumberStore((state) => state.activeSongIndex);

  const transposeUp = useTranspositionNumberStore((state) => state.transposeUpArray);
  const transposeDown = useTranspositionNumberStore((state) => state.transposeDownArray);
  const setInactiveTransposition = useTranspositionNumberStore((state) => state.setInactiveTransposition);

  if (!transpositionArray || !Array.isArray(transpositionArray) || transpositionArray.length === 0) {
    console.log('Transposition array is not properly initialized:', transpositionArray);
    return (
      <Text>Initializing</Text>
    ); // or return a fallback UI
  }

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        bottom: 0,
        height: 100,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#24232B',
        paddingHorizontal: 15,
        paddingVertical: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
        <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
            {title}
          </Text>
        </View>
        <Pressable
          style={{ position: 'absolute', right: 0, padding: 8 }}
          onPress={setInactiveTransposition}
        >
          <Text style={{ fontSize: 18, color: '#fff' }}>✕</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            style={{ flexDirection: 'row' }}
            onPress={() => transposeUp(activeSongIndex)}
          >
            <FontAwesome6 name="arrow-up-long" size={34} color="#f2f2f2" />
            <MaterialCommunityIcons name="music-accidental-sharp" size={30} color="#f2f2f2" />
          </Pressable>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 25, color: '#f2f2f2' }}>
            {transpositionArray[activeSongIndex]}
          </Text>
        </View>

        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            style={{ flexDirection: 'row' }}
            onPress={() => transposeDown(activeSongIndex)}
          >
            <FontAwesome6 name="arrow-down-long" size={34} color="#f2f2f2" />
            <MaterialCommunityIcons name="music-accidental-flat" size={30} color="#f2f2f2" />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default TranspositionTab;
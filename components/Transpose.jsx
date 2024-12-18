import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useTranspositionNumberStore } from '../state/store';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Transpose = () => {

  const transpositionNumber = useTranspositionNumberStore((state) => state.transpositionNumber);
  const transposeUp = useTranspositionNumberStore((state) => state.transposeUp);
  const transposeDown = useTranspositionNumberStore((state) => state.transposeDown);

  return (
    <View style={{ height: 80, borderTopLeftRadius: 25, borderTopRightRadius: 25, backgroundColor: '#24232B' }}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            style={{ flexDirection: 'row'}}
            onPress={transposeUp}
          >
            <FontAwesome6 name="arrow-up-long" size={34} color="#f2f2f2" />
            <MaterialCommunityIcons name="music-accidental-sharp" size={30} color="#f2f2f2" />
          </Pressable>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
          <Text style={{ fontSize: 25, color: '#f2f2f2'}}>{transpositionNumber}</Text>
        </View>
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            style={{ flexDirection: 'row'}}
            onPress={transposeDown}
          >
            <FontAwesome6 name="arrow-down-long" size={34} color="#f2f2f2" />
            <MaterialCommunityIcons name="music-accidental-flat" size={30} color="#f2f2f2" />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default Transpose
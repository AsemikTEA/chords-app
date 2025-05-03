import { View, Text, Pressable } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useAutoscrollStore } from '../state/store';

const AutoscrollSpeed = () => {

  const autoScrollSpeed = useAutoscrollStore((state) => state.autoScrollSpeed);

  const setAutoScrollSpeed = useAutoscrollStore((state) => state.setAutoScrollSpeed);

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: '#24232B',
      padding: 15,
      zIndex: 999,
      elevation: 10,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
    }}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            style={{ flexDirection: 'row' }}
            onPress={() => setAutoScrollSpeed(autoScrollSpeed + 1)}
          >
            <FontAwesome6 name="arrow-up-long" size={34} color="#f2f2f2" />
          </Pressable>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
          <Text style={{ fontSize: 25, color: '#f2f2f2' }}>{autoScrollSpeed}</Text>
        </View>
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            style={{ flexDirection: 'row' }}
            onPress={() => setAutoScrollSpeed(autoScrollSpeed - 1)}
          >
            <FontAwesome6 name="arrow-down-long" size={34} color="#f2f2f2" />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default AutoscrollSpeed
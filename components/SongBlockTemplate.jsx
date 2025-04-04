import { View, Text, Pressable } from 'react-native'
import React from 'react'

const SongBlockTemplate = ({ title, style, handlePress }) => {
  return (
    <Pressable
      style={{ borderWidth: 1, flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#24232B' }}
      onPress={handlePress}
    >
      <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>{title}</Text>
    </Pressable>
  )
}

export default SongBlockTemplate
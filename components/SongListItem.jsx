import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '../style/styles'
import { router } from 'expo-router'

const SongListItem = ({ item, handlePress }) => {
  return (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={handlePress}
    >
        <Text style={styles.listItemSongName}>{item.name}</Text>
        <Text style={styles.listItemAuthor}>{item.author}</Text>
    </TouchableOpacity>
  )
}

export default SongListItem;
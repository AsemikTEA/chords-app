import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '../style/styles'

const SongListItem = ({ item, handlePress }) => {
  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={handlePress}
    >
      <Text style={styles.listItemSongName}>{item.name}</Text>
      <Text style={styles.listItemAuthor}>{item.artist_id[0].name}</Text>
    </TouchableOpacity>
  )
}

export default SongListItem;
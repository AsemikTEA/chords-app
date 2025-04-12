import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { styles } from '../style/styles'

const PlaylistListItem = ({ item, handlePress, handleLongPress }) => {

  const countOfSongs = item.songs.length;
  
  return (
    <TouchableOpacity
      style={styles.versionListItem}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <View style={styles.versionListItemName}>
        <Text style={styles.versionListItemNameText}>{item.name}</Text>
      </View>
      <View style={styles.versionListItemRating}>
        <View style={styles.versionListItemText}>
          <Text>Songs: {countOfSongs}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default PlaylistListItem;
import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '../style/styles'
import { Link } from 'expo-router'

const SongListItem = ({ item, handlePress, handlePressArtist }) => {
  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={handlePress}
    >
      <Text style={styles.listItemSongName}>{item.name}</Text>
      <Link
        style={styles.listItemAuthor}
        href={'/artist-songs'}
        onPress={handlePressArtist}
      >
        {item.artist_id[0].name}
      </Link>
    </TouchableOpacity>
  )
}

export default SongListItem;
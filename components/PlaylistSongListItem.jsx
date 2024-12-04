import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '../style/styles'

const PlaylistSongListItem = ({ item, handlePress }) => {

  // const playlistSongs = usePlaylistSongs();

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={handlePress}
    >
      <Text style={styles.listItemSongName}>{item.metadata.title}</Text>
      <Text style={styles.listItemAuthor}>Version: {item.version}</Text>
    </TouchableOpacity>
  )
}

export default PlaylistSongListItem
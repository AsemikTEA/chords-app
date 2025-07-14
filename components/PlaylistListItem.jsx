import { Text, TouchableOpacity, View } from 'react-native'
import { styles } from '../style/styles'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const PlaylistListItem = ({ item, handlePress, handleLongPress }) => {

  const countOfSongs = item.playlist_id.songs.length;

  return (
    <TouchableOpacity
      style={styles.versionListItem}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <View style={styles.versionListItemName}>
        <Text style={styles.versionListItemNameText}>{item.playlist_id.name}</Text>
      </View>

      {item.role === 2 && (
        <MaterialCommunityIcons
          name="account-multiple-outline"
          size={24}
          color="black"
          style={{ alignSelf: 'center' }}
        />
      )}

      <View style={styles.versionListItemRating}>
        <View style={styles.versionListItemText}>
          <Text>Songs: {countOfSongs}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default PlaylistListItem;
import { Text, TouchableOpacity, View } from 'react-native'
import { styles } from '../style/styles'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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

      {item.is_shared && (
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
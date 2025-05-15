import { Text, TouchableOpacity, View } from 'react-native'
import { styles } from '../style/styles'
import { Ionicons } from '@expo/vector-icons';

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
        
          <Ionicons
            name="people"
            size={20}
            style={{ alignSelf: 'center',}}
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
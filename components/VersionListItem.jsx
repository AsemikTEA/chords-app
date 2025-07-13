import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from '../style/styles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const VersionListItem = ({ item, handlePress }) => {
  return (
    <TouchableOpacity
      style={styles.versionListItem}
      onPress={handlePress}
    >
      <View style={styles.versionListItemName}>
        <Text style={styles.versionListItemNameText}>Version {item.version}</Text>
      </View>
      <View style={styles.versionListItemRating}>
        {(item.userTransposition !== undefined && item.userTransposition !== 0) &&
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
            <Text style={{ fontSize: 16 }}>Your</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="music-accidental-flat"
                size={24}
                color="black"
                style={{ padding: 0, marginRight: -7 }} // zmenšíme mezeru mezi ♭ a ♯
              />
              <MaterialCommunityIcons
                name="music-accidental-sharp"
                size={24}
                color="black"
                style={{ padding: 0, marginLeft: -7, marginRight: -5 }} // zmenšíme mezeru mezi ♭ a ♯
              />
            </View>
            <Text style={{ fontSize: 16 }}>: {item.userTransposition}</Text>
          </View>
        }
      </View>
      {/* <View style={styles.versionListItemRating}>
                <View style={styles.versionListItemText}>
                    <Text>{item.rating.average}</Text>
                </View>
                <View style={styles.versionListItemText}>
                    <Text>({item.rating.count})</Text>
                </View>
            </View> */}
    </TouchableOpacity>
  )
}

export default VersionListItem
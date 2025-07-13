import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { styles } from '../style/styles';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const PlaylistSongListItem = ({ item, handlePress, handleDeletePress }) => {

  return (
    <>
    <TouchableOpacity
      style={[styles.listItem, { flexDirection: 'row' }]}
      onPress={handlePress}
    >

      <View style={{ flex: 3 }}>
        <Text style={styles.listItemSongName}>{item.version.metadata.title}</Text>
        <Text style={styles.listItemAuthor}>Version: {item.version.version}</Text>
      </View>
      <View style={{ flex: 1.8 }}>
        {(item.userTransposition !== undefined && item.userTransposition !== 0) &&
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10, justifyContent: 'flex-end' }}>
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={handleDeletePress}
        >
          <AntDesign name="close" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    </>
  )
}

export default PlaylistSongListItem
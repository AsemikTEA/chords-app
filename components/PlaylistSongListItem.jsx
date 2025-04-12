import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { styles } from '../style/styles';
import AntDesign from '@expo/vector-icons/AntDesign';

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
        {item.userTransposition && (
          <Text>transposition: {item.userTransposition}</Text>
        )}
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
import { View, Text, TextInput } from 'react-native'
import React, { useEffect } from 'react'
import { useSongContentStore } from '../state/store';
import { styles } from '../style/styles';

const SongContentInput = ({ text }) => {

  const setContent = useSongContentStore((state) => state.setContent);
  const content = useSongContentStore((state) => state.content);

  useEffect(() => {
    console.log(content);
  }, [content]);

  return (
    <View>
      <Text style={styles.formTextStyle}>Content</Text>
      <View>
        <TextInput
          value={content}
          style={{
            fontSize: 17,
            flex: 1,
            textAlignVertical: 'top',
            borderRadius: 3,
            borderWidth: 1,
            padding: 3
          }}
          multiline={true}
          //numberOfLines={10}
          scrollEnabled={true}
          onChangeText={(e) => { setContent(e)}}
        />
      </View>
    </View>
  )
}

export default SongContentInput
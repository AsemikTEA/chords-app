import { View, Text, TextInput } from 'react-native'
import React, { useEffect } from 'react'
import { useSongContentStore } from '../state/store';
import { styles } from '../style/styles';

const SongContentInput = ({ value, handleChangeText }) => {

  const setContent = useSongContentStore((state) => state.setContent);
  const content = useSongContentStore((state) => state.content);

  useEffect(() => {
    console.log(content);
  }, [content]);

  return (
    <TextInput
      value={value}
      style={{
        fontSize: 17,
        flex: 1,
        textAlignVertical: 'top',
        borderRadius: 3,
        borderWidth: 1,
        padding: 3
      }}
      multiline={true}
      scrollEnabled={true}
      onChangeText={handleChangeText}
    />
  )
}

export default SongContentInput
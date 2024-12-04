import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import { styles } from '../style/styles';
import React from 'react'

const SubmitButton = ({handlePress, textValue, style}) => {
  return (
    <TouchableOpacity
    style={style}
    onPress={ handlePress }
    >
        <Text style={styles.buttonTextStyle}>{textValue}</Text>
    </TouchableOpacity>
  )
}

export default SubmitButton
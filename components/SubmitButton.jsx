import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import { styles } from '../style/styles';
import React from 'react'

const SubmitButton = ({handlePress, textValue}) => {
  return (
    <TouchableOpacity
    style={styles.submitButton}
    onPress={ handlePress }
    >
        <Text style={styles.buttonTextStyle}>{textValue}</Text>
    </TouchableOpacity>
  )
}

export default SubmitButton
import { View, Text, TextInput } from 'react-native';
import { styles } from '../style/styles';
import React from 'react';

const FormField = ({title, value, placeholder, style, handleChangeText, hidePassword, ...props}) => {
  return (
    <View>
      <Text style={styles.formTextStyle}>{title}</Text>
      <View>
        <TextInput 
            value={value}
            onChangeText={handleChangeText}
            style={styles.formTextInput}
            placeholder={placeholder}
            secureTextEntry={hidePassword}
        />
      </View>
    </View>
  );
};

export default FormField;
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { styles } from '../style/styles';
import React from 'react';
import { Controller } from 'react-hook-form';

const FormField = ({ title, placeholder, hidePassword, errors, control }) => {
  return (
    <View>
      <Text>{title}</Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
            message: "Invalid email address",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.formTextInput}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={hidePassword}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
      {/* <Text style={styles.formTextStyle}>{title}</Text>
      <View>
        <TextInput 
            value={value}
            onChangeText={handleChangeText}
            style={styles.formTextInput}
            placeholder={placeholder}
            secureTextEntry={hidePassword}
            maxLength={maxLength}
        />
      </View> */}
    </View>
  );
};

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default FormField;
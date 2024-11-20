import { View, Text, TextInput } from 'react-native';
import React, { useEffect } from 'react';
import { SearchBar } from '@rneui/themed';
import { styles } from '../style/styles';
import { useSearchStore } from '../state/store';

const SearchForm = () => {

  const setSongName = useSearchStore((state) => state.setSongName);

  return (
    <View style={styles.searchForm}>
      <SearchBar
      onChangeText={(e) => {setSongName(e)}}
        platform="android"
        clearIcon={{ color: "black" }}
        searchIcon={{ color: "black" }}
        cancelIcon={{ color: "black" }}
        containerStyle={{
          backgroundColor: "#f2f2f2",
          borderRadius: 10,
          justifyContent: 'center',
          flex: 1
        }}
        inputContainerStyle={{
          backgroundColor: "#f2f2f2",
          borderRadius: 20,
        }}
        inputStyle={{
          backgroundColor: "#f2f2f2",
          borderRadius: 20,
          borderWidth: 1,
          paddingLeft: 10
        }}
        placeholder="Type query here..."
      />
    </View>
  );
};

export default SearchForm;
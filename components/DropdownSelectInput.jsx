import { View, Text, TextInput } from 'react-native';
import { styles } from '../style/styles';
import React from 'react';
import { useSongContentStore } from '../state/store';
import { SelectList } from 'react-native-dropdown-select-list';

const DropdownSelectInput = ({ title, value, placeholder, style, handleChangeText, hidePassword, maxLength, ...props }) => {
  
  const setCapo = useSongContentStore((state) => state.setCapo);
  const songMetaData = useSongContentStore((state) => state.songMetaData);

  const data = [
    { key: '1', value: 1 },
    { key: '2', value: 2 },
    { key: '3', value: 3 },
    { key: '4', value: 4 },
    { key: '5', value: 5 },
    { key: '6', value: 6 },
    { key: '8', value: 8 },
    { key: '9', value: 9 },
    { key: '10', value: 10 },
    { key: '11', value: 11 },
    { key: '12', value: 12 },
    { key: '13', value: 13 },
    { key: '14', value: 14 },
    { key: '15', value: 15 },
  ]
  
  return (
    <View>
      <Text style={styles.formTextStyle}>{title}</Text>
      <View>
        <SelectList
          defaultOption={{ key: songMetaData.capo, value: songMetaData.capo}}
          setSelected={(val) => { setCapo(val) }}
          data={data}
          save="value"
          label='Capo'
        />
      </View>
    </View>
  );
};

export default DropdownSelectInput;
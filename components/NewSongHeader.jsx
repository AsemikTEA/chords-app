import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';
import { styles } from '../style/styles';
import ModalDropdown from 'react-native-modal-dropdown';

const NewSongHeader = ({ song, }) => {

  const pathname = usePathname()

  const saveVersion = () => {

  };

  const editVersion = () => {

  };

  const func = (value) => {
    if (value === 'Transpose') {
      return '';
    }
  }

  return (
    <View style={styles.header}>
      <Pressable
        style={styles.backButton}
        onPress={() => { router.back() }}
      >
        <Ionicons name="chevron-back" size={28} color="black" />
      </Pressable>
      {pathname === '/create' && (
        <>
          <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 8, paddingLeft: 20 }}>
            <Text style={styles.headerMainTitle}>New Song</Text>
          </View>
          <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Pressable
              style={styles.backButton}
              onPress={() => { saveVersion }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Save</Text>
            </Pressable>
          </View>
        </>
      ) || (
          <>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 8, paddingLeft: 20 }}>
              <Text style={styles.headerMainTitle}>Edit Song</Text>
            </View>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
              <Pressable
                style={styles.backButton}
                onPress={() => { editVersion }}
              >
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Save</Text>
              </Pressable>
            </View>
          </>

        )
      }
    </View>
  )
}

export default NewSongHeader;
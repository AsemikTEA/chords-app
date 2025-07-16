import { View, Text, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { styles } from '../style/styles';

const NewSongHeader = ({ onSubmit }) => {

  const pathname = usePathname();

  const goBack = () => {
    router.back();
  }

  return (
    <View style={styles.header}>
      <Pressable
        style={styles.backButton}
        onPress={goBack}
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
              onPress={onSubmit}
            >
              <Ionicons name="save" size={26} color="black" />
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
                onPress={onSubmit}
              >
                <MaterialCommunityIcons name="content-save-edit" size={26} color="black" />
              </Pressable>
            </View>
          </>

        )
      }
    </View>
  )
}

export default NewSongHeader;
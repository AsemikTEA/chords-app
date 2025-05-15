import { Stack } from 'expo-router'
import { Header } from 'react-native/Libraries/NewAppScreen';
import { styles } from '../../style/styles';
import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';

const UserLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='invites'
          options={{
            header: () => <View style={styles.header}>
              <Pressable
                style={styles.backButton}
                onPress={() => {
                  router.back()
                }}
              >
                <Ionicons name="chevron-back" size={28} color="black" />
              </Pressable>

              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerMainTitle}>Your Invites</Text>
              </View>

            </View>,
          }}
        />
      </Stack>
    </>
  )
}

export default UserLayout;
import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { styles } from '../../style/styles'
import { Button } from '@rneui/base'

const AuthLayout = () => {

  const headerTitle = () => {
    return  <View>
      <Text style={styles.listItemSongName}>Perfect</Text>
      <Text style={styles.listItemAuthor}>Ed Sheeran</Text>
    </View>
  }

  return (
    <>
      <Stack>
        <Stack.Screen
          name='song-versions'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='display'
          options={{
            // headerShown: false
          }}
        />
        <Stack.Screen
          name='create'
          options={{
            // headerShown: false
          }}
        />
      </Stack>
    </>
  )
}

export default AuthLayout
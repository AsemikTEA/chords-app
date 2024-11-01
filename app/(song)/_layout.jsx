import { View, Text, Pressable } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { styles } from '../../style/styles'
import { Button } from '@rneui/base'
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '../../components/Header'

const AuthLayout = () => {

  const headerTitle = () => {
    return <View>
      <Text style={styles.listItemSongName}>Perfect</Text>
      <Text style={styles.listItemAuthor}>Ed Sheeran</Text>
    </View>
  }

  const song =
    {
        name: "Afterglow",
        author: "Ed Sheeran"
    }

  return (
    <>
      <Stack
        // screenOptions={{
        //   headerTintColor: "black",
        //   headerLeft: () => (
        //     <Ionicons name="chevron-back" size={28} color="black" />
        //   ),
        //   headerRight: () => <View />,
        // }}
      >
        <Stack.Screen
          name='song-versions'
          options={{
            header: () => <Header song={song} />
          }}
        />
        <Stack.Screen
          name='display'
          options={{
            header: () => <Header song={song} />
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
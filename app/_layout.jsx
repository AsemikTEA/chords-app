import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router';

const HomeLayout = () => {
  return (
    <>
      <Stack>
          <Stack.Screen name="index" options={{headerShown: false}} />
          <Stack.Screen name="(auth)" options={{
            headerShown: false
            }} />
          <Stack.Screen name="(tabs)" options={{
            headerShown: false
            }} />
          <Stack.Screen name="(song)" options={{headerShown: false}} />
      </Stack>
    </>
  )
}

export default HomeLayout;
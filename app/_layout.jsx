import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const HomeLayout = () => {

  const queryClient = new QueryClient();

  return (

    <>
    <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </>
  )
}

export default HomeLayout;
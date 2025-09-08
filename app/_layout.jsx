import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../style/styles';

const HomeLayout = () => {

  const queryClient = new QueryClient();

  return (
    
    <SafeAreaView style={[styles.container, {paddingTop: 10}]} edges={['bottom', 'left', 'right']}>
      <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(song)" options={{ headerShown: false }} />
            <Stack.Screen name="(playlist)" options={{ headerShown: false }} />
            <Stack.Screen name="(user)" options={{ headerShown: false }} />
          </Stack>
          <FlashMessage position="top" duration={3000} floating={true} icon="auto" />
      </QueryClientProvider >
      </SafeAreaView>
  )
}

export default HomeLayout;
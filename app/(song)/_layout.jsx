import { Stack } from 'expo-router'
import Header from '../../components/Header'
import NewSongHeader from '../../components/NewSongHeader'

const SongLayout = () => {

  return (
    <>
      <Stack>
        <Stack.Screen
          name='song-versions'
          options={{
            header: () => <Header/>
          }}
        />
        <Stack.Screen
          name='display'
        />
        <Stack.Screen
          name='create'
        />
        <Stack.Screen
          name='edit'
        />
      </Stack>
    </>
  )
}

export default SongLayout
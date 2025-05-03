import { Stack } from 'expo-router'
import PlaylistHeader from '../../components/PlaylistHeader'
import DisplayPlaylistHeader from '../../components/DisplayPlaylistHeader'

const AuthLayout = () => {

  return (
    <>
      <Stack>
        <Stack.Screen
          name='playlist-songs'
          options={{
            header: () => <PlaylistHeader/>
          }}
        />
        <Stack.Screen
          name='display-playlist'
          options={{
            header: () => <DisplayPlaylistHeader/>
          }}
        />
        <Stack.Screen
          name='edit-playlist'
          options={{
            header: () => <PlaylistHeader/>
          }}
        />
      </Stack>
    </>
  )
}

export default AuthLayout
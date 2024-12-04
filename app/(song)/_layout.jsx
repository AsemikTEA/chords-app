import { Stack } from 'expo-router'
import Header from '../../components/Header'
import NewSongHeader from '../../components/NewSongHeader'

const AuthLayout = () => {

  // const songId = useSongVersionStore((state) => state.songId);
  // const versions = useSongVersions(songId);

  const song =
    {
        name: "Afterglow",
        author: "Ed Sheeran"
    }

  return (
    <>
      <Stack>
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
            header: () => <NewSongHeader/>
          }}
        />
        <Stack.Screen
          name='edit'
          options={{
            header: () => <NewSongHeader/>
          }}
        />
      </Stack>
    </>
  )
}

export default AuthLayout
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import PlaylistHeader from '../../components/PlaylistHeader';

const TabsLayout = () => {

  return (
    <>
      <Tabs
        initialRouteName="search"
        backBehavior="history"
        screenOptions={{
          tabBarActiveTintColor: 'white',
          tabBarStyle: {
            height: 70,
            margin: 10,
            marginTop: 0,
            borderRadius: 20,
            borderColor: '#24232B',
            borderTopColor: '#24232B',
            backgroundColor: '#24232B',
            position: 'absolute',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          tabBarIconStyle: {
            marginTop: 5
          }
        }}
      >
        <Tabs.Screen
          name='search'
          options={{
            title: 'Search',
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              let iconColor;
              iconColor = focused ? 'white' : '#8e8e8e'
              return <FontAwesome name="search" size={24} color={iconColor} />;
            }
          }}
        />
        <Tabs.Screen
          name='playlists'
          options={{
            title: 'Playlists',
            header: () => <PlaylistHeader name={'Your playlists'}/>,
            tabBarIcon: ({ focused }) => {
              let iconColor;
              iconColor = focused ? 'white' : '#8e8e8e'
              return <MaterialCommunityIcons name="playlist-music" size={28} color={iconColor} />;
            }
          }}
        />
        <Tabs.Screen
          name='user-edited-songs'
          options={{
            title: 'My songs',
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              let iconColor;
              iconColor = focused ? 'white' : '#8e8e8e'
              return <MaterialCommunityIcons name="account-music" size={28} color={iconColor} />;
            }
          }}
        />
        <Tabs.Screen
          name='account'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              let iconColor;
              iconColor = focused ? 'white' : '#8e8e8e'
              return <MaterialCommunityIcons name="account-cog" size={28} color={iconColor} />;
            }
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout;
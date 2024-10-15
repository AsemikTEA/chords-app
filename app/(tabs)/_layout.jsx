import { Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';
import { styles } from '../../style/styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// import { useUserStore } from '../../context/userStore';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// import Ionicons from '@expo/vector-icons/Ionicons';

const TabsLayout = () => {

  //   const user = useUserStore((state) => state.user);

  //   if (user == null) return <Redirect replace href='/sign-in'/>;

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
            marginBottom: 10,
          },
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
            // headerShown: false,
            tabBarIcon: ({ focused }) => {
              let iconColor;
              iconColor = focused ? 'white' : '#8e8e8e'
              return <MaterialCommunityIcons name="playlist-music" size={28} color={iconColor} />;
            }
          }}
        />
        <Tabs.Screen
          name='account'
          options={{
            title: 'Account',
            // headerShown: false,
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
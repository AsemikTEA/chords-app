import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const TabPlaylistPlayButton = () => {

  return (
    <View style={{ height: 50, width: '100%', position: 'absolute', bottom: 0, marginBottom: 20, backgroundColor: 'transparent', paddingLeft: 20, paddingRight: 20, }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', backgroundColor: '#24232B', borderRadius: 100}}>
        <Pressable 
        style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}
          onPress={() => {
            router.navigate('/display-playlist'); 
          }}  
        >
          <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold'}}>Play</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default TabPlaylistPlayButton
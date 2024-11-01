import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../../style/styles'
import { router } from 'expo-router'

const Account = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 10}}>
      <Pressable 
        style={{borderWidth: 1, height: 50, justifyContent: 'center', padding: 5}}
        onPress={() => { router.navigate('/create') }}
        >
        <Text style={{fontSize: 20}}>Create song</Text>
      </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default Account
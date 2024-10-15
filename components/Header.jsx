import { View, Text } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const Header = ({ song }) => {
    return (
        <View style={{flexDirection: 'row'}}>
            <View>
                <Ionicons name="chevron-back" size={24} color="black" />
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>{song.name}</Text>
                <Text>{song.author}</Text>
            </View>
        </View>
    )
}

export default Header;
import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { styles } from '../style/styles';

const Header = ({ song }) => {
    return (
        <View style={styles.header}>
            <Pressable 
                style={styles.backButton}
                onPress={() => {router.back()}}    
            >
                <Ionicons name="chevron-back" size={28} color="black" />
            </Pressable>
            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerMainTitle}>{song.name}</Text>
                <Text>{song.author}</Text>
            </View>
            <View style={{ flex: 1 }}></View>
        </View>
    )
}

export default Header;
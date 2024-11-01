import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { styles } from '../style/styles';
import ModalDropdown from 'react-native-modal-dropdown';

const Header = ({ song }) => {

    const func = (value) => {
        if(value==='Transpose') {
            return '';
        }
    }

    return (
        <View style={styles.header}>
            <Pressable
                style={styles.backButton}
                onPress={() => { router.back() }}
            >
                <Ionicons name="chevron-back" size={28} color="black" />
            </Pressable>
            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerMainTitle}>{song.name}</Text>
                <Text>{song.author}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ModalDropdown
                    saveScrollPosition={false}
                    options={['Transpose', 'Share', 'Export as PDF']}
                    dropdownStyle={{ borderWidth: 2, top: 0 }}
                    dropdownTextStyle={{ color: 'black', fontSize: 15 }}
                    dropdownTextHighlightStyle={{ color: 'black' }}
                    onSelect={(index, value) => func(value)}
                >
                    <Ionicons name="ellipsis-vertical" size={30} color="black" />
                </ModalDropdown>
            </View>
        </View>
    )
}

export default Header;
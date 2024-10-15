import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '../style/styles'

const VersionListItem = ({ item, handlePress }) => {
    return (
        <TouchableOpacity
            style={styles.versionListItem}
            onPress={handlePress}
        >
            <View style={styles.versionListItemName}>
                <Text style={styles.versionListItemNameText}>Version {item.version}</Text>
            </View>
            <View style={styles.versionListItemRating}>
                <View style={styles.versionListItemText}>
                    <Text>{item.rating.average}</Text>
                </View>
                <View style={styles.versionListItemText}>
                    <Text>({item.rating.count})</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default VersionListItem
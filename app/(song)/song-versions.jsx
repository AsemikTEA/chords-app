import { View, Text } from 'react-native'
import React from 'react'
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import VersionListItem from '../../components/VersionListItem';
import { router } from 'expo-router';
import Header from '../../components/Header';

const SongVersions = () => {

    const data = [
        {
            _id: {
                $oid: "66ebfdc676125891b2a01882"
            },
            name: "Perfect",
            version: 1,
            metadata: {
                title: "Perfect",
                artist: "Ed Sheeran",
                album: "Divide",
                key: "C",
                capo: 2
            },
            content: "{c: Verse1} admkclkl [A]asdmkmk {c: Chorus} [C]asdkjlkxjlkjc",
            rating: {
                count: 50,
                average: 4.6,
            },
            song_id: {
                $oid: "66ea8a79076688b18f4a2bce"
            },
        },
        {
            _id: {
                $oid: "66ebfdc676125891b2a01882"
            },
            name: "Perfect",
            version: 2,
            metadata: {
                title: "Perfect",
                artist: "Ed Sheeran",
                album: "Divide",
                key: "C",
                capo: 2
            },
            content: "{c: Verse1} admkclkl [A]asdmkmk {c: Chorus} [C]asdkjlkxjlkjc",
            rating: {
                count: 50,
                average: 4.6,
            },
            song_id: {
                $oid: "66ea8a79076688b18f4a2bce"
            }
        },
    ];

    const song =
    {
        name: "Afterglow",
        author: "Ed Sheeran"
    }

    const separator = () => {
        return <View style={styles.separator} />;
    };

    const versionListItem = ({ item }) => {
        return (
            <VersionListItem
                item={item}
                handlePress={() => { router.navigate('/display') }}
            />)
    };

    return (
        <SafeAreaView
            style={styles.container}
        >
            <Header song={song} />
            <FlashList
                data={data}
                renderItem={versionListItem}
                estimatedItemSize={20}
                ItemSeparatorComponent={separator}
            />
        </SafeAreaView>
    );
}

export default SongVersions
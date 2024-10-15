import { View, Text, TextInput, ScrollView } from 'react-native';
import React from 'react';
import { Link, Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchForm from '../../components/SearchForm';
import { styles } from '../../style/styles';
import { FlashList } from '@shopify/flash-list';
import SongListItem from '../../components/SongListItem';

const Search = () => {

    const data = [
        {
            name: "Afterglow",
            author: "Ed Sheeran"
        },
        {
            name: "Perfect",
            author: "Ed Sheeran"
        },
        {
            name: "Lego House",
            author: "Ed Sheeran"
        },
        {
            name: "Lego House",
            author: "Ed Sheeran"
        }, {
            name: "Lego House",
            author: "Ed Sheeran"
        }, {
            name: "Lego House",
            author: "Ed Sheeran"
        }, {
            name: "Lego House",
            author: "Ed Sheeran"
        }, {
            name: "Lego House",
            author: "Ed Sheeran"
        }, {
            name: "Lego House",
            author: "Ed Sheeran"
        }, {
            name: "Lego House",
            author: "Ed Sheeran"
        }, {
            name: "Lego House",
            author: "Ed Sheeran"
        }, {
            name: "Lego House",
            author: "Ed Sheeran"
        }
    ]

    const separator = () => {
        return <View style={styles.separator} />;
    };

    const songListItem = ({ item }) => {
        return <SongListItem
            item={item}
            handlePress={() => { router.navigate('/song-versions') }}
        />
    };

    return (
        <SafeAreaView
            style={styles.container}>
            <SearchForm />
            <FlashList
                data={data}
                renderItem={songListItem}
                estimatedItemSize={20}
                ItemSeparatorComponent={separator}
            />
        </SafeAreaView>
    );
};

export default Search;
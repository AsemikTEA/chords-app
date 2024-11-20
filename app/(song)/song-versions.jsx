import { View, Text } from 'react-native'
import React from 'react'
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import VersionListItem from '../../components/VersionListItem';
import { router } from 'expo-router';
import { useSongVersions } from '../../hooks/useSongVersions';
import { useSongVersionStore } from '../../state/store';
const SongVersions = () => {

  const songId = useSongVersionStore((state) => state.songId);

  const setVersionId = useSongVersionStore((state) => state.setVersionId);

  const versions = useSongVersions(songId);

  const separator = () => {
    return <View style={styles.separator} />;
  };

  const versionListItem = ({ item }) => {
    return (
      <VersionListItem
        item={item}
        handlePress={() => { 
          setVersionId(item._id); 
          router.navigate('/display') 
        }}
      />)
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <FlashList
        data={versions.data}
        renderItem={versionListItem}
        estimatedItemSize={20}
        ItemSeparatorComponent={separator}
      />
    </SafeAreaView>
  );
}

export default SongVersions
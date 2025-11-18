import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { FlashList } from '@shopify/flash-list';
import { styles } from '../../style/styles';
import VersionListItem from '../../components/VersionListItem';
import { router, useNavigation } from 'expo-router';
import { useSongVersions } from '../../hooks/useSongVersions';
import { useSongContentStore, useSongVersionStore, useUserStore } from '../../state/store';
import Header from '../../components/Header';

const SongVersions = () => {

  const navigation = useNavigation();

  const songId = useSongVersionStore((state) => state.songId);
  const setVersionId = useSongVersionStore((state) => state.setVersionId);
  const songMetaData = useSongContentStore((state) => state.songMetaData);

  const songData = {
    songId: songId,
    userId: useUserStore.getState().user.id,
  }

  const versions = useSongVersions(songData);

  useEffect(() => {
    console.log('songMetaData v headeru:', songMetaData);
    navigation.setOptions({
      header: () => <Header
        song={songMetaData?.title ?? ''}
        artist={songMetaData?.artist ?? ''}
      />
    });
  }, [navigation, songMetaData]);

  const separator = () => {
    return <View style={styles.separator} />;
  };

  const versionListItem = ({ item }) => {
    return (
      <VersionListItem
        item={item}
        handlePress={() => {
          setVersionId(item._id);
          router.navigate('/display');
        }}
      />)
  };

  if (versions.isPending) {
    return <Text>Loading...</Text>;
  }

  if (versions.isError) {
    return <Text>Error fetching versions. Please try again.</Text>;
  }

  if (!versions.data || !versions.data.length === 0) {
    return <Text>No versions available for this song.</Text>;
  }

  return (
    <>
      <FlashList
        data={versions.data}
        renderItem={versionListItem}
        estimatedItemSize={20}
        ItemSeparatorComponent={separator}
      />
    </>
  );
}

export default SongVersions
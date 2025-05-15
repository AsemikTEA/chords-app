import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../style/styles';
import { FlashList } from '@shopify/flash-list';
import { useSongVersionStore, useUserStore } from '../../state/store';
import { useSearchPersonalVersions } from '../../hooks/useSearchPersonalVersions';
import AntDesign from '@expo/vector-icons/AntDesign';
import { showMessage } from 'react-native-flash-message';

const UserEditedSongs = () => {

  const userData = useUserStore((state) => state.user);
  const setVersionId = useSongVersionStore((state) => state.setVersionId);

  const personalVersions = useSearchPersonalVersions(userData.id);

  const separator = () => {
    return <View style={styles.separator} />;
  };

  const versionListItem = ({ item }) => {
    return (
      <>
        <TouchableOpacity
          style={[styles.listItem, { flexDirection: 'row' }]}
          onPress={() => {
            setVersionId(item._id);
            router.navigate('/display');
          }}
        >
          <View style={{ flex: 3 }}>
            <Text style={styles.listItemSongName}>{item.metadata.title}</Text>
            <Text style={styles.listItemAuthor}>{item.metadata.artist}</Text>
            <Text style={styles.listItemAuthor}>Version: {item.version}</Text>
          </View>
          <View style={{ flex: 1.8 }}>
            {item.metadata.transposition && (
              <Text>transposition: {item.metadata.transposition}</Text>
            )}
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => console.log('pressed')}
            >
              <AntDesign name="close" size={28} color="black" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </>
    )
  };

  if (personalVersions.isLoading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (personalVersions.isError) {
    showMessage({
      message: 'Error loading personal versions',
      description: personalVersions.error.message,
      type: 'danger',
    });
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View>
          <Text>Error: {personalVersions.error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <View style={{ marginTop: 40 }} />
      <FlashList
        data={personalVersions.data}
        renderItem={versionListItem}
        estimatedItemSize={20}
        ItemSeparatorComponent={separator}
      />
    </SafeAreaView>
  );
};

export default UserEditedSongs;
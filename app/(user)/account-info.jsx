import React from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../state/store';
import { useDeleteUser } from '../../hooks/useDeleteUser';

const AccountInfo = () => {
  const user = useUserStore((state) => state.user);

  const deleteUser = useDeleteUser();

  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              deleteUser.mutate(user.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account.');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>User not logged in.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{user.username}</Text>

        <Text style={[styles.label, { marginTop: 15 }]}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Pressable onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AccountInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  infoContainer: {
    flex: 1,
    gap: 5,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  value: {
    fontSize: 20,
    color: '#333',
  },
  deleteText: {
    marginTop: 40,
    color: '#D32F2F',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});

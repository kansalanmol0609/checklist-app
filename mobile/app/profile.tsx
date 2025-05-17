import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAuth } from '@/contexts/auth';
import withAuth from '@/components/withAuth';

function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Profile
      </Text>
      {user && (
        <>
          <Text style={styles.info}>Name: {user.name}</Text>
          <Text style={styles.info}>Email: {user.email}</Text>
        </>
      )}
      <Button mode="contained" style={styles.button} onPress={logout}>
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 16,
  },
  info: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 32,
    width: '80%',
  },
});

export default withAuth(ProfileScreen);

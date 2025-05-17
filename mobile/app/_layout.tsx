import React from 'react';
import { Slot } from 'expo-router';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import { DataProvider } from '@/contexts/data';
import { THEME } from '@/constants/theme';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaperProvider theme={THEME}>
          <DataProvider>
            <SafeAreaView style={styles.container}>
              <Slot />
            </SafeAreaView>
          </DataProvider>
        </PaperProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});

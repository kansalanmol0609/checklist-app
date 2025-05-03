import React from 'react';
import { Slot } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { DataProvider } from '@/contexts/data';
import { THEME } from '@/constants/theme';

export default function RootLayout() {
  return (
    <PaperProvider theme={THEME}>
      <DataProvider>
        <Slot />
      </DataProvider>
    </PaperProvider>
  );
}

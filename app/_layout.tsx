import React, { useEffect, useState, createContext } from 'react';
import { Slot } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { Checklist } from './types';

export const ChecklistContext = createContext<{
  checklists: Checklist[];
  setChecklists: (checklists: Checklist[]) => void;
}>({
  checklists: [],
  setChecklists: () => {},
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load from AsyncStorage once
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('checklists');
      if (stored) setChecklists(JSON.parse(stored));
      setIsReady(true);
    })();
  }, []);

  // Persist on changes
  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem('checklists', JSON.stringify(checklists));

      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [checklists, isReady]);

  // if (!isReady) return <SplashScreen />;

  return (
    <ChecklistContext.Provider value={{ checklists, setChecklists }}>
      <Slot />
    </ChecklistContext.Provider>
  );
}

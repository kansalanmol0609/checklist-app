import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, BottomNavigation } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '@/contexts/data';
import ChecklistTemplatesList from '@/components/ChecklistTemplatesList';
import ChecklistsList from '@/components/ChecklistList';

const ROUTES = [
  {
    key: 'checklist',
    title: 'Checklist',
    icon: ({ color, size }: { color: string; size: number }) => (
      <MaterialCommunityIcons
        name="checkbox-marked-outline"
        color={color}
        size={size}
      />
    ),
  },
  {
    key: 'templates',
    title: 'Templates',
    icon: ({ color, size }: { color: string; size: number }) => (
      <MaterialCommunityIcons
        name="clipboard-list-outline"
        color={color}
        size={size}
      />
    ),
  },
];

export default function HomePage() {
  const [index, setIndex] = React.useState(0);

  const renderScene = BottomNavigation.SceneMap({
    checklist: ChecklistsList,
    templates: ChecklistTemplatesList,
  });

  return (
    <SafeAreaView style={styles.container}>
      <BottomNavigation
        navigationState={{ index, routes: ROUTES }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderIcon={({ route, focused, color }) => {
          const icon = ROUTES.find((r) => r.key === route.key)?.icon;
          return icon ? icon({ color, size: focused ? 24 : 20 }) : null;
        }}
        barStyle={styles.navbar}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  navbar: {
    backgroundColor: '#FFFFFF',
    // elevation for Android shadow
    elevation: 4,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

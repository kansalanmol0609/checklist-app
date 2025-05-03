import React from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
} from 'react-native';
import { Card, Title } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '@/contexts/data';
import { Checklist } from '@/types';
import { CHECKLIST_COLOR_SCHEMES } from '@/constants/checklistColorSchemes';

export default function ChecklistsList() {
  const { checklists, isReady } = useData();
  const { width } = useWindowDimensions();

  // Determine number of columns based on screen width
  let numColumns = 1;
  if (width >= 900) numColumns = 3;
  else if (width >= 600) numColumns = 2;

  if (!isReady) return null; // or a loading indicator

  const renderChecklist = ({ item }: { item: Checklist }) => {
    const scheme = CHECKLIST_COLOR_SCHEMES[item.colorScheme];
    const maxItems = 5;
    const hasMore = item.items.length > maxItems;
    const visibleItems = item.items.slice(0, maxItems);

    return (
      <Card style={[styles.card, { backgroundColor: scheme.background }]}>
        <Card.Content>
          {/* Header: icon + title */}
          <View style={styles.header}>
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={scheme.icon}
              style={styles.icon}
            />
            <Title style={[styles.title, { color: scheme.text }]}>
              {item.title}
            </Title>
          </View>

          {/* Checklist items (up to 5) */}
          <View style={styles.itemsContainer}>
            {visibleItems.map((it) => (
              <View key={it.id} style={styles.itemRow}>
                <MaterialCommunityIcons
                  name={
                    it.completed ? 'checkbox-marked' : 'checkbox-blank-outline'
                  }
                  size={16}
                  color={scheme.icon}
                  style={styles.itemIcon}
                />
                <Text
                  style={[styles.itemText, { color: scheme.text }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {it.text}
                </Text>
              </View>
            ))}
            {hasMore && (
              <Text style={[styles.moreText, { color: scheme.icon }]}>
                +{item.items.length - maxItems} more
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <FlatList
      key={numColumns}
      data={checklists}
      keyExtractor={(c) => c.id}
      renderItem={renderChecklist}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemsContainer: {
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemIcon: {
    marginRight: 4,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
  },
  moreText: {
    marginTop: 4,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

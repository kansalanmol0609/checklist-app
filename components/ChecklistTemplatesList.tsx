import React, { useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Card, Title } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useData } from '@/contexts/data';
import { CHECKLIST_COLOR_SCHEMES } from '@/constants/checklistColorSchemes';
import FilterBar from '@/components/FilterBar';
import { ChecklistTemplate } from '@/types';

export default function TemplatesList() {
  const { templates, isReady } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<
    keyof typeof CHECKLIST_COLOR_SCHEMES | undefined
  >(undefined);
  const { width } = useWindowDimensions();
  const router = useRouter();

  // Determine columns: mobile = 1, web/tablet = 2 or 3
  let numColumns = 1;
  if (width >= 900) numColumns = 3;
  else if (width >= 600) numColumns = 2;

  if (!isReady) return null;

  // Filter templates by search text and color
  const filtered = templates.filter((t) => {
    const matchesColor = selectedColor ? t.colorScheme === selectedColor : true;
    if (!matchesColor) return false;

    if (!searchQuery.trim()) return true;

    const inTitle = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const inItems = t.items.some((it) =>
      it.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return inTitle || inItems;
  });

  const handleAddTemplate = () => router.push('/checklist-template/create');

  const renderTemplate = ({ item }: { item: ChecklistTemplate }) => {
    const scheme = CHECKLIST_COLOR_SCHEMES[item.colorScheme];
    const maxItems = 5;
    const visibleItems = item.items.slice(0, maxItems);
    const hasMore = item.items.length > maxItems;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/checklist-template/view/${item.id}`)}
        style={[styles.cardWrapper, { backgroundColor: scheme.background }]}
      >
        <Card style={[styles.card, { backgroundColor: scheme.background }]}>
          <Card.Content>
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

            <View style={styles.itemsContainer}>
              {visibleItems.map((it) => (
                <View key={it.id} style={styles.itemRow}>
                  <MaterialCommunityIcons
                    name="checkbox-blank-outline"
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
      </TouchableOpacity>
    );
  };

  // Empty state when no templates exist
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="playlist-plus" size={48} color="#999" />
      <Text style={styles.emptyText}>
        Create your first template by clicking the + icon above.
      </Text>
    </View>
  );

  // No match state when filter yields nothing
  const renderNoMatch = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="magnify" size={48} color="#999" />
      <Text style={styles.emptyText}>No templates match your search.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedColor={selectedColor}
        onColorPress={setSelectedColor}
        onAddPress={handleAddTemplate}
      />

      {!templates.length ? (
        renderEmpty()
      ) : filtered.length === 0 ? (
        renderNoMatch()
      ) : (
        <FlatList
          key={numColumns}
          data={filtered}
          keyExtractor={(t) => t.id}
          renderItem={renderTemplate}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContainer: {
    padding: 16,
    rowGap: 16,
  },
  row: {
    justifyContent: 'space-between',
    columnGap: 16,
  },
  cardWrapper: {
    flex: 1,
    margin: 0,
  },
  card: {
    flex: 1,
    margin: 0,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

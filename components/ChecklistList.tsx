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
import { Checklist } from '@/types';

export default function ChecklistsList() {
  const { checklists, isReady } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<
    keyof typeof CHECKLIST_COLOR_SCHEMES | undefined
  >(undefined);
  const { width } = useWindowDimensions();
  const router = useRouter();

  // Determine columns based on width
  let numColumns = 1;
  if (width >= 900) numColumns = 3;
  else if (width >= 600) numColumns = 2;

  if (!isReady) return null;

  // Filter by search text (title or items) and color
  const query = searchQuery.trim().toLowerCase();
  const filtered = checklists.filter((cl) => {
    const matchesColor = selectedColor
      ? cl.colorScheme === selectedColor
      : true;
    if (!matchesColor) return false;
    if (!query) return true;
    const inTitle = cl.title.toLowerCase().includes(query);
    const inItems = cl.items.some((it) =>
      it.text.toLowerCase().includes(query)
    );
    return inTitle || inItems;
  });

  const handleAddChecklist = () => router.push('/checklist/create');

  const renderChecklist = ({ item }: { item: Checklist }) => {
    const scheme = CHECKLIST_COLOR_SCHEMES[item.colorScheme];
    const maxItems = 5;
    const visibleItems = item.items.slice(0, maxItems);
    const hasMore = item.items.length > maxItems;

    const completedCount = item.items.filter((i) => i.completed).length;
    const totalCount = item.items.length;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/checklist/view/${item.id}`)}
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
              <View style={styles.titleBlock}>
                <Title style={[styles.title, { color: scheme.text }]}>
                  {item.title}
                </Title>

                <Text style={[styles.subText, { color: scheme.text }]}>
                  {completedCount} / {totalCount} done
                </Text>
              </View>
            </View>
            <View style={styles.itemsContainer}>
              {visibleItems.map((it) => (
                <View key={it.id} style={styles.itemRow}>
                  <MaterialCommunityIcons
                    name={
                      it.completed
                        ? 'checkbox-marked'
                        : 'checkbox-blank-outline'
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
      </TouchableOpacity>
    );
  };

  // Empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="playlist-plus" size={48} color="#999" />
      <Text style={styles.emptyText}>
        Create your first checklist by clicking the + icon above.
        <View style={{ height: 8 }} />
      </Text>
    </View>
  );

  // No match state
  const renderNoMatch = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="magnify" size={48} color="#999" />
      <Text style={styles.emptyText}>No checklists match your search.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedColor={selectedColor}
        onColorPress={setSelectedColor}
        onAddPress={handleAddChecklist}
      />

      {!checklists.length ? (
        renderEmpty()
      ) : filtered.length === 0 ? (
        renderNoMatch()
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          renderItem={renderChecklist}
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
  icon: { marginRight: 8 },
  titleBlock: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  subText: {
    fontSize: 14,
    marginTop: 2,
  },
  itemsContainer: { marginTop: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  itemIcon: { marginRight: 4 },
  itemText: { flex: 1, fontSize: 14 },
  moreText: { marginTop: 4, fontSize: 14, fontStyle: 'italic' },
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

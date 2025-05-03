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
import { ChecklistTemplate } from '@/types';
import { CHECKLIST_COLOR_SCHEMES } from '@/constants/checklistColorSchemes';

export default function ChecklistTemplatesList() {
  const { templates, isReady } = useData();
  const { width } = useWindowDimensions();

  // Determine columns: mobile = 1, web/tablet = 2 or 3
  let numColumns = 1;
  if (width >= 900) numColumns = 3;
  else if (width >= 600) numColumns = 2;

  if (!isReady) return null;

  const renderTemplate = ({ item }: { item: ChecklistTemplate }) => {
    const scheme = CHECKLIST_COLOR_SCHEMES[item.colorScheme];
    const maxItems = 5;
    const hasMore = item.items.length > maxItems;
    const visibleItems = item.items.slice(0, maxItems);

    return (
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
    );
  };

  return (
    <FlatList
      key={numColumns}
      data={templates}
      keyExtractor={(t) => t.id}
      renderItem={renderTemplate}
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

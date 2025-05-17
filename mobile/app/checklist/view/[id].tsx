import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Appbar, ProgressBar, TextInput, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useData } from '@/contexts/data';
import { CHECKLIST_COLOR_SCHEMES } from '@/constants/checklistColorSchemes';

export default function ViewChecklistTemplate() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { checklists, removeChecklist, updateChecklist } = useData();

  const checklist = checklists.find((t) => t.id === id);
  if (!checklist) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Template not found</Text>
      </View>
    );
  }

  const [searchQuery, setSearchQuery] = useState('');
  const filteredItems = checklist.items
    .filter((item) =>
      item.text.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
    .sort((a, b) => Number(a.completed) - Number(b.completed));

  const colorScheme = CHECKLIST_COLOR_SCHEMES[checklist.colorScheme];

  const handleEdit = () => {
    router.push(`/checklist/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Checklist',
      'Are you sure you want to delete this checklist? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            router.back();
            await removeChecklist(id);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const completedCount = checklist.items.filter((i) => i.completed).length;
  const totalCount = checklist.items.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <>
      <Appbar.Header style={styles.header} statusBarHeight={0}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={checklist.title}
          titleStyle={{
            color: colorScheme.text,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'left',
          }}
        />
        <Appbar.Action
          icon="pencil-outline"
          color={colorScheme.icon}
          onPress={handleEdit}
        />
        <Appbar.Action
          icon="delete-outline"
          color={theme.colors.error}
          onPress={handleDelete}
        />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={[
          styles.body,
          { backgroundColor: colorScheme.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Icon Badge */}
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colorScheme.background },
          ]}
        >
          <MaterialCommunityIcons
            name={checklist.icon as any}
            size={48}
            color={colorScheme.icon}
          />
        </View>

        <Text
          style={{
            color: colorScheme.text,
            fontSize: 24,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          {checklist.title}
        </Text>

        <View
          style={[
            styles.progressContainer,
            { backgroundColor: colorScheme.background },
          ]}
        >
          <ProgressBar
            progress={progress}
            color={colorScheme.icon}
            style={styles.progressBar}
          />
          <Text style={[styles.progressText, { color: colorScheme.text }]}>
            {completedCount} / {totalCount} done
          </Text>
        </View>

        {/* Search Items */}
        <TextInput
          mode="outlined"
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { borderColor: colorScheme.icon }]}
          outlineColor={colorScheme.icon}
          activeOutlineColor={theme.colors.primary}
        />

        {/* Items List */}
        {filteredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              updateChecklist({
                ...checklist,
                items: checklist.items.map((i) =>
                  i.id === item.id ? { ...i, completed: !item.completed } : i
                ),
              });
            }}
            style={{ marginBottom: 12 }}
          >
            <View style={[styles.itemRow]}>
              <MaterialCommunityIcons
                name={
                  item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'
                }
                size={24}
                color={colorScheme.icon}
                style={styles.itemIcon}
                aria-checked={item.completed}
              />
              <Text style={[styles.itemText, { color: colorScheme.text }]}>
                {item.text}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="magnify-close"
              size={40}
              color={theme.colors.secondary}
            />
            <Text style={[styles.emptyText, { color: theme.colors.secondary }]}>
              No item matched your search.
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
      default: {
        // Web or other platforms
        elevation: 4,
      },
    }),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  notFound: { fontSize: 18, color: '#666' },
  progressContainer: {
    paddingVertical: 8,
  },
  progressBar: { height: 8, borderRadius: 4 },
  progressText: { marginTop: 4, fontSize: 14, textAlign: 'center' },
  body: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  searchInput: { marginBottom: 16, borderWidth: 1 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    borderRadius: 8,
  },
  itemIcon: { marginRight: 8 },
  itemText: { fontSize: 16, flexShrink: 1 },
  emptyContainer: {
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { marginTop: 8, fontSize: 16, textAlign: 'center' },
});

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  Alert,
} from 'react-native';
import { Appbar, TextInput, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useData } from '@/contexts/data';
import { CHECKLIST_COLOR_SCHEMES } from '@/constants/checklistColorSchemes';

export default function ViewChecklistTemplate() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { templates, removeTemplate } = useData();

  const template = templates.find((t) => t.id === id);
  if (!template) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Template not found</Text>
      </View>
    );
  }

  const [searchQuery, setSearchQuery] = useState('');
  const filteredItems = template.items.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const colorScheme = CHECKLIST_COLOR_SCHEMES[template.colorScheme];

  const handleEdit = () => {
    router.push(`/checklist-template/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            router.back();
            await removeTemplate(id);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <Appbar.Header style={styles.header} statusBarHeight={0}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={template.title}
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
            name={template.icon as any}
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
          {template.title}
        </Text>

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
          <View
            key={item.id}
            style={[
              styles.itemRow,
              { backgroundColor: colorScheme.background },
            ]}
          >
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              size={20}
              color={colorScheme.icon}
              style={styles.itemIcon}
            />
            <Text style={[styles.itemText, { color: colorScheme.text }]}>
              {item.text}
            </Text>
          </View>
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
    marginBottom: 8,
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

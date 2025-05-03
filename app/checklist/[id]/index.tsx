// app/checklist/[id]/page.tsx  (Checklist detail)

import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  Checkbox,
  TextInput,
  IconButton,
} from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';
import type { ChecklistItem, IconName } from '../../../types';
import IconColorPicker from '../../../components/IconColorPicker';
import { useData } from '@/contexts/data';
import { ChecklistColorScheme } from '@/constants/checklistColorSchemes';

export default function ChecklistPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { checklists, updateTemplate } = useData();

  const checklist = checklists.find((c) => c.id === id);

  const [text, setText] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);

  const toggleItem = (itemId: string) => {
    updateTemplate(
      checklists.map((c) =>
        c.id === id
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, completed: !i.completed } : i
              ),
            }
          : c
      )
    );
  };

  const addItem = () => {
    if (!text.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
    };
    updateTemplate(
      checklists.map((c) =>
        c.id === id ? { ...c, items: [...c.items, newItem] } : c
      )
    );
    setText('');
  };

  if (!checklist) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="headlineMedium">Checklist not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons
          name={checklist.icon}
          size={32}
          color={checklist.colorScheme}
          style={{ marginRight: 12 }}
        />
        <Text variant="headlineMedium">{checklist.title}</Text>
        <IconButton icon="pencil" onPress={() => setPickerVisible(true)} />
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={checklist.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Checkbox.Item
            label={item.text}
            status={item.completed ? 'checked' : 'unchecked'}
            onPress={() => toggleItem(item.id)}
            color={checklist.colorScheme}
          />
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          mode="outlined"
          placeholder="New item..."
          value={text}
          onChangeText={setText}
          style={{ flex: 1 }}
        />
        <Button onPress={addItem} style={{ marginLeft: 8 }}>
          Add
        </Button>
      </View>

      {/* <IconColorPicker
        visible={pickerVisible}
        onDismiss={() => setPickerVisible(false)}
        initialIcon={checklist.icon}
        initialColor={checklist.colorScheme}
        onSelect={saveIconColor}
      /> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
  },
});

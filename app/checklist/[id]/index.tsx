import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ChecklistContext } from '../../_layout';
import { Checklist } from '@/app/types';

export default function ChecklistPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { checklists, setChecklists } = useContext<{
    checklists: Checklist[];
    setChecklists: (checklists: Checklist[]) => void;
  }>(ChecklistContext);
  const checklist = checklists.find((c) => c.id === id) || {
    name: '',
    items: [],
  };
  const [text, setText] = useState('');

  const toggleItem = (itemId: string) => {
    setChecklists(
      checklists.map((c) =>
        c.id === id
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, done: !i.done } : i
              ),
            }
          : c
      )
    );
  };

  const addItem = () => {
    if (!text.trim()) return;
    setChecklists(
      checklists.map((c) =>
        c.id === id
          ? {
              ...c,
              items: [
                ...c.items,
                { id: Date.now().toString(), text: text.trim(), done: false },
              ],
            }
          : c
      )
    );
    setText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{checklist.name}</Text>
      <FlatList
        data={checklist.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleItem(item.id)}>
            <Text style={[styles.item, item.done && styles.done]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New item"
          value={text}
          onChangeText={setText}
        />
        <Button title="Add" onPress={addItem} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 16, color: '#000' },
  item: { fontSize: 18, padding: 10, color: '#000' },
  done: { textDecorationLine: 'line-through', color: '#888' },
  inputContainer: { flexDirection: 'row', marginTop: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    padding: 8,
    marginRight: 8,
    color: '#000',
  },
});

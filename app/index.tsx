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
import { ExternalPathString, useRouter } from 'expo-router';
import { ChecklistContext } from './_layout';
import { Checklist } from './types';

export default function HomePage() {
  const { checklists, setChecklists } = useContext<{
    checklists: Checklist[];
    setChecklists: (checklists: Checklist[]) => void;
  }>(ChecklistContext);
  const [name, setName] = useState('');
  const router = useRouter();

  const addChecklist = () => {
    if (!name.trim()) return;
    setChecklists([
      ...checklists,
      { id: Date.now().toString(), name: name.trim(), items: [] },
    ]);
    setName('');
  };

  const goToChecklist = (id: string) => {
    router.push({
      pathname: '/checklist/[id]' as ExternalPathString,
      params: { id },
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={checklists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => goToChecklist(item.id)}>
            <Text style={styles.item}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New checklist"
          value={name}
          onChangeText={setName}
        />
        <Button title="Add" onPress={addChecklist} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  item: {
    fontSize: 18,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    color: '#000',
  },
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

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useData } from '@/contexts/data';
import Header from '@/components/Header';
import { Checklist } from '@/types';
import ChecklistForm from '@/components/ChecklistForm';

export default function EditChecklist() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { checklists, updateChecklist } = useData();

  const checklist = checklists.find((t) => t.id === id);

  // If checklist not found, navigate back or show a message
  if (!checklist) {
    router.back();
    return null;
  }

  const handleSubmit = async (updated: Checklist) => {
    await updateChecklist(updated);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Edit Checklist" showBack />
      <ChecklistForm
        checklist={checklist}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
});

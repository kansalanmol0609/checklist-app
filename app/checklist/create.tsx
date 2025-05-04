import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '@/contexts/data';
import Header from '@/components/Header';
import { Checklist } from '@/types';
import ChecklistForm from '@/components/ChecklistForm';

export default function CreateChecklistTemplate() {
  const router = useRouter();
  const { addChecklist } = useData();

  const handleSubmit = async (template: Checklist) => {
    await addChecklist(template);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="New Checklist" showBack />
      <ChecklistForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showTemplatePicker
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
});

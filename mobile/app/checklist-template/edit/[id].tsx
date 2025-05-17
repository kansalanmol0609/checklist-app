import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useData } from '@/contexts/data';
import Header from '@/components/Header';
import ChecklistTemplateForm from '@/components/ChecklistTemplateForm';
import { ChecklistTemplate } from '@/types';

export default function EditChecklistTemplate() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { templates, updateTemplate } = useData();

  const template = templates.find((t) => t.id === id);

  // If template not found, navigate back or show a message
  if (!template) {
    router.back();
    return null;
  }

  const handleSubmit = async (updated: ChecklistTemplate) => {
    await updateTemplate(updated);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Edit Template" showBack />
      <ChecklistTemplateForm
        template={template}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
});

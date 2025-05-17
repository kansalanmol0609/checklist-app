import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '@/contexts/data';
import Header from '@/components/Header';
import ChecklistTemplateForm from '@/components/ChecklistTemplateForm';
import { ChecklistTemplate } from '@/types';

export default function CreateChecklistTemplate() {
  const router = useRouter();
  const { addTemplate } = useData();

  const handleSubmit = async (template: ChecklistTemplate) => {
    await addTemplate(template);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="New Template" showBack />
      <ChecklistTemplateForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
});

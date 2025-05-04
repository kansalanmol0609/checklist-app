import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ChecklistTemplate, ChecklistTemplateItem } from '@/types';
import {
  CHECKLIST_COLOR_SCHEMES,
  DEFAULT_CHECKLIST_COLOR_SCHEME,
} from '@/constants/checklistColorSchemes';
import ColorPicker from '@/components/ColorPicker';
import IconPicker from '@/components/IconPicker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { IconName } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface ChecklistTemplateFormProps {
  /** existing template to edit, or undefined for create */
  template?: ChecklistTemplate;
  /** called with new/updated template */
  onSubmit: (tpl: ChecklistTemplate) => void;
  /** called to cancel editing */
  onCancel: () => void;
}

export default function ChecklistTemplateForm({
  template,
  onSubmit,
  onCancel,
}: ChecklistTemplateFormProps) {
  const theme = useTheme();
  // initialize state from template or defaults
  const [title, setTitle] = useState(template?.title || '');
  const [icon, setIcon] = useState<IconName>(template?.icon || 'briefcase');
  const [colorScheme, setColorScheme] = useState<
    keyof typeof CHECKLIST_COLOR_SCHEMES
  >(template?.colorScheme || DEFAULT_CHECKLIST_COLOR_SCHEME);
  const [items, setItems] = useState<ChecklistTemplateItem[]>(
    template?.items.map((i) => ({ ...i })) || [{ id: uuidv4(), text: '' }]
  );

  // Determine whether Save is enabled
  const canSave =
    title.trim() !== '' && items.some((i) => i.text.trim() !== '');

  const addItem = () =>
    setItems((prev) => [...prev, { id: uuidv4(), text: '' }]);

  const updateItem = (id: string, text: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, text } : i)));
  };
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    if (!canSave) return;

    const filteredItems = items
      .filter((i) => i.text.trim() !== '')
      .map((i, idx) => ({ id: i.id, text: i.text.trim() }));

    const result: ChecklistTemplate = {
      id: template?.id || uuidv4(),
      title: title.trim(),
      icon,
      colorScheme,
      items: filteredItems,
    };
    onSubmit(result);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Template Name</Text>
          <TextInput
            placeholder="Template Name"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            outlineColor={theme.colors.secondary}
            activeOutlineColor={theme.colors.primary}
            style={styles.input}
          />

          <View style={styles.row}>
            <View style={styles.pickerBlock}>
              <Text style={styles.label}>Icon</Text>
              <IconPicker
                value={icon}
                onChange={(nextIcon) => setIcon(nextIcon)}
              />
            </View>
            <View style={styles.pickerBlock}>
              <Text style={styles.label}>Color</Text>
              <ColorPicker
                hideEmpty
                value={colorScheme}
                onChange={(next) =>
                  setColorScheme(next ?? DEFAULT_CHECKLIST_COLOR_SCHEME)
                }
              />
            </View>
          </View>

          {items.map((item, idx) => (
            <View key={item.id} style={styles.itemRow}>
              <TextInput
                placeholder={`Item ${idx + 1}`}
                value={item.text}
                onChangeText={(t) => updateItem(item.id, t)}
                mode="outlined"
                outlineColor={theme.colors.secondary}
                activeOutlineColor={theme.colors.primary}
                style={styles.itemInput}
              />
              <TouchableOpacity
                onPress={() => removeItem(item.id)}
                disabled={items.length <= 1}
                style={[{ marginLeft: 8 }]}
              >
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={28}
                  color={theme.colors.error}
                  style={[items.length <= 1 && { opacity: 0.5 }]}
                />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            onPress={addItem}
            style={{
              width: 160,
            }}
          >
            <Text style={[styles.addText, { color: theme.colors.primary }]}>
              + Add another item
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={onCancel} style={styles.btn}>
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.btn}
          disabled={!canSave}
        >
          Save Template
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  container: { padding: 16 },
  input: { marginBottom: 16, backgroundColor: 'transparent' },
  row: { flexDirection: 'row', marginBottom: 16 },
  pickerBlock: { marginRight: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  iconScroll: { flexDirection: 'row' },
  iconOption: {
    padding: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    marginRight: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 12,
  },
  bullet: { marginRight: 8 },
  itemInput: { flex: 1, backgroundColor: 'transparent' },
  addText: { fontSize: 16, marginVertical: 8 },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  btn: { flex: 1, marginHorizontal: 8 },
});

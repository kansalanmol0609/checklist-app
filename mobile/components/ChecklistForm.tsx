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
import { Checklist, ChecklistItem } from '@/types';
import {
  CHECKLIST_COLOR_SCHEMES,
  DEFAULT_CHECKLIST_COLOR_SCHEME,
} from '@/constants/checklistColorSchemes';
import ColorPicker from '@/components/ColorPicker';
import IconPicker from '@/components/IconPicker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { IconName } from '@/types';
import TemplatePicker from './TemplatePicker';
import { useData } from '@/contexts/data';
import { DEFAULT_ICON } from '@/constants/icon';

export interface ChecklistFormProps {
  /** existing checklist to edit, or undefined for create */
  checklist?: Checklist;
  /** called with new/updated checklist */
  onSubmit: (nextCheckList: Checklist) => void;
  /** called to cancel editing */
  onCancel: () => void;
  showTemplatePicker?: boolean;
}

export default function ChecklistForm({
  checklist,
  onSubmit,
  onCancel,
  showTemplatePicker,
}: ChecklistFormProps) {
  const theme = useTheme();

  const { templates } = useData();

  // initialize state from checklist or defaults
  const [title, setTitle] = useState(checklist?.title || '');
  const [icon, setIcon] = useState<IconName>(checklist?.icon || 'briefcase');
  const [colorScheme, setColorScheme] = useState<
    keyof typeof CHECKLIST_COLOR_SCHEMES
  >(checklist?.colorScheme || DEFAULT_CHECKLIST_COLOR_SCHEME);
  const [items, setItems] = useState<ChecklistItem[]>(
    checklist?.items.map((i) => ({ ...i })) || [
      { id: uuidv4(), text: '', completed: false },
    ]
  );

  const [templateId, setTemplateId] = useState<string | undefined>(undefined);

  // Determine whether Save is enabled
  const canSave =
    title.trim() !== '' && items.some((i) => i.text.trim() !== '');

  const addItem = () =>
    setItems((prev) => [...prev, { id: uuidv4(), text: '', completed: false }]);

  const updateItem = (id: string, text: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, text } : i)));
  };
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleChangeTemplate = (templateId?: string) => {
    setTemplateId(templateId);

    if (templateId) {
      // load existing template into form
      const tpl = templates.find((t) => t.id === templateId);
      if (tpl) {
        setTitle(tpl.title);
        setIcon(tpl.icon);
        setColorScheme(tpl.colorScheme);
        setItems(
          tpl.items.map((i) => ({ id: i.id, text: i.text, completed: false }))
        );
      }
    } else {
      // reset to defaults
      setTitle('');
      setIcon(DEFAULT_ICON);
      setColorScheme(DEFAULT_CHECKLIST_COLOR_SCHEME);
      setItems([{ id: uuidv4(), text: '', completed: false }]);
    }
  };

  const handleSave = () => {
    if (!canSave) return;

    const filteredItems = items
      .filter((i) => i.text.trim() !== '')
      .map((i, idx) => ({
        id: i.id,
        text: i.text.trim(),
        completed: i.completed || false,
      }));

    const result: Checklist = {
      id: checklist?.id || uuidv4(),
      title: title.trim(),
      icon,
      colorScheme,
      items: filteredItems,
      templateId: showTemplatePicker ? templateId : undefined,
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
          {/* Template loader */}
          {showTemplatePicker ? (
            <>
              <Text style={styles.label}>Select Existing Template</Text>
              <TemplatePicker
                value={templateId}
                onChange={handleChangeTemplate}
              />
            </>
          ) : null}

          <Text style={styles.label}>Checklist Name</Text>
          <TextInput
            placeholder="Checklist Name"
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
          Save
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

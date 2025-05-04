import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  Text,
} from 'react-native';
import { Portal, Surface, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '@/contexts/data';
import { CHECKLIST_COLOR_SCHEMES } from '@/constants/checklistColorSchemes';

export interface TemplatePickerProps {
  value?: string;
  onChange: (id?: string) => void;
}

export default function TemplatePicker({
  value,
  onChange,
}: TemplatePickerProps) {
  const theme = useTheme();
  const { templates } = useData();
  const [visible, setVisible] = useState(false);
  const { width, height } = Dimensions.get('window');

  const toggleMenu = () => setVisible((v) => !v);
  const closeMenu = () => setVisible(false);

  const selectTemplate = (id?: string) => {
    onChange(id);
    closeMenu();
  };

  // derive selected template
  const selectedTpl = templates.find((t) => t.id === value);
  const scheme = selectedTpl
    ? CHECKLIST_COLOR_SCHEMES[selectedTpl.colorScheme]
    : ({} as any);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            borderColor: scheme.icon ?? theme.colors.backdrop,
            backgroundColor: scheme.background ?? 'transparent',
          },
        ]}
        onPress={toggleMenu}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            rowGap: 8,
          }}
        >
          <MaterialCommunityIcons
            name={selectedTpl ? (selectedTpl.icon as any) : 'playlist-edit'}
            size={24}
            color={scheme.icon ?? theme.colors.secondary}
            style={{
              flex: 0,
              borderColor: scheme.icon ?? theme.colors.secondary,
            }}
          />

          <Text style={{ flex: 1, marginLeft: 8, color: scheme.text }}>
            {selectedTpl ? selectedTpl.title : 'Select a Template'}
          </Text>

          <MaterialCommunityIcons
            name={'chevron-down'}
            size={28}
            color={theme.colors.secondary}
            style={{
              flex: 0,

              borderColor: scheme.icon,
            }}
          />
        </View>
      </TouchableOpacity>

      <Portal>
        {visible && (
          <>
            <TouchableWithoutFeedback onPress={closeMenu}>
              <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            <Surface
              style={[
                styles.popover,
                { top: height * 0.2, left: 16, right: 16 },
              ]}
            >
              <FlatList
                data={templates}
                keyExtractor={(t) => t.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => {
                  const isSelected = item.id === value;
                  const scheme = CHECKLIST_COLOR_SCHEMES[item.colorScheme];
                  return (
                    <TouchableOpacity
                      style={[
                        styles.itemRow,
                        isSelected && {
                          backgroundColor: scheme.background,
                        },
                      ]}
                      onPress={() => selectTemplate(item.id)}
                    >
                      <MaterialCommunityIcons
                        name={item.icon as any}
                        size={20}
                        color={
                          isSelected ? scheme.icon : theme.colors.secondary
                        }
                        style={styles.rowIcon}
                      />
                      <Text
                        style={[
                          styles.rowText,
                          isSelected && { color: scheme.text },
                        ]}
                      >
                        {item.title}
                      </Text>
                      {isSelected && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={20}
                          color={scheme.icon}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />

              <TouchableOpacity
                style={[styles.clearRow, { opacity: !value ? 0.5 : 1 }]}
                onPress={() => selectTemplate(undefined)}
                disabled={!value}
              >
                <Text
                  style={[styles.clearText, { color: theme.colors.primary }]}
                >
                  Clear Selection
                </Text>
              </TouchableOpacity>
            </Surface>
          </>
        )}
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    height: 56,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    margin: 0,
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  popover: {
    position: 'absolute',
    maxHeight: 300,
    padding: 12,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    paddingVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  clearRow: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

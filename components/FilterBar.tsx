import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CHECKLIST_COLOR_SCHEMES } from '@/constants/checklistColorSchemes';
import ColorPicker from './ColorPicker';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedColor?: keyof typeof CHECKLIST_COLOR_SCHEMES;
  onColorPress: (
    nextColor: keyof typeof CHECKLIST_COLOR_SCHEMES | undefined
  ) => void;
  onAddPress: () => void;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedColor,
  onColorPress,
  onAddPress,
}: FilterBarProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        placeholder="Search..."
        value={searchQuery}
        onChangeText={onSearchChange}
        style={styles.input}
        // left={<TextInput.Icon name="magnify" />}
        outlineColor={theme.colors.backdrop}
        activeOutlineColor={theme.colors.primary}
      />

      <ColorPicker value={selectedColor} onChange={onColorPress} />

      <TouchableOpacity style={styles.addIcon} onPress={onAddPress}>
        <MaterialCommunityIcons
          name="plus-circle"
          size={40}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    marginRight: 8,
    height: 40,
  },
  circle: {
    marginRight: 8,
  },
  addIcon: {},
});

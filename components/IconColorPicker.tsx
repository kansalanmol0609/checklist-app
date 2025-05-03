// components/IconColorPicker.tsx

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal, Portal, Button, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ICONS = ['airplane', 'dumbbell', 'run', 'shopping', 'star'];
const COLORS = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];

type Props = {
  visible: boolean;
  onDismiss: () => void;
  initialIcon: string;
  initialColor: string;
  onSelect: (icon: string, color: string) => void;
};

export default function IconColorPicker({
  visible,
  onDismiss,
  initialIcon,
  initialColor,
  onSelect,
}: Props) {
  const { colors: themeColors } = useTheme();
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
          Choose Icon
        </Text>
        <View style={styles.iconGrid}>
          {ICONS.map((ic) => (
            <TouchableOpacity
              key={ic}
              onPress={() => setSelectedIcon(ic)}
              style={[
                styles.iconWrapper,
                selectedIcon === ic && {
                  borderColor: themeColors.primary,
                  borderWidth: 2,
                },
              ]}
            >
              <MaterialCommunityIcons name={ic} size={32} />
            </TouchableOpacity>
          ))}
        </View>

        <Text variant="titleMedium" style={{ marginVertical: 8 }}>
          Choose Color
        </Text>
        <View style={styles.colorGrid}>
          {COLORS.map((col) => (
            <TouchableOpacity
              key={col}
              onPress={() => setSelectedColor(col)}
              style={[
                styles.colorSwatch,
                { backgroundColor: col },
                selectedColor === col && {
                  borderWidth: 2,
                  borderColor: themeColors.primary,
                },
              ]}
            />
          ))}
        </View>

        <Button
          mode="contained"
          onPress={() => {
            onSelect(selectedIcon, selectedColor);
            onDismiss();
          }}
        >
          Done
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  iconWrapper: {
    padding: 8,
    margin: 4,
    borderRadius: 4,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colorSwatch: {
    width: 32,
    height: 32,
    margin: 4,
    borderRadius: 4,
  },
});

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Portal, Surface, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconName } from '@/types';
import { ICON_OPTIONS } from '@/constants/icon';

export interface IconPickerProps {
  value: IconName;
  onChange: (nextValue: IconName) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const toggleMenu = () => setVisible((v) => !v);
  const closeMenu = () => setVisible(false);

  // Determine trigger styling
  const triggerStyle = value
    ? { borderColor: theme.colors.primary, borderWidth: 2 }
    : { borderColor: theme.colors.secondary, borderWidth: 1 };

  const selectIcon = (iconKey: IconName) => {
    onChange(iconKey);
    closeMenu();
  };

  const { width, height } = Dimensions.get('window');

  return (
    <>
      <TouchableOpacity
        style={[styles.trigger, triggerStyle]}
        onPress={toggleMenu}
      >
        <MaterialCommunityIcons
          name={value ?? 'emoticon-outline'}
          size={24}
          color={value ? theme.colors.primary : theme.colors.secondary}
        />
      </TouchableOpacity>

      <Portal>
        {visible && (
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.backdrop}>
              <Surface
                style={[
                  styles.popover,
                  { top: height * 0.2, left: 16, right: 16 },
                ]}
              >
                <View style={styles.grid}>
                  {/* Icon options */}
                  {ICON_OPTIONS.map((iconKey) => {
                    const isSelected = value === iconKey;
                    return (
                      <TouchableOpacity
                        key={iconKey}
                        style={[
                          styles.circle,
                          isSelected && {
                            borderColor: theme.colors.primary,
                            borderWidth: 2,
                          },
                        ]}
                        onPress={() => selectIcon(iconKey)}
                      >
                        <MaterialCommunityIcons
                          name={iconKey as IconName}
                          size={24}
                          color={
                            isSelected
                              ? theme.colors.primary
                              : theme.colors.secondary
                          }
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Surface>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 4,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  popover: {
    position: 'absolute',
    padding: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
    borderWidth: 1,
  },
});

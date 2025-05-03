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
import { CHECKLIST_COLOR_SCHEMES } from '@/constants/checklistColorSchemes';

interface ColorPickerProps {
  value?: keyof typeof CHECKLIST_COLOR_SCHEMES;
  onChange: (colorKey?: keyof typeof CHECKLIST_COLOR_SCHEMES) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  // Determine trigger style
  const triggerStyle = value
    ? {
        backgroundColor: CHECKLIST_COLOR_SCHEMES[value].background,
        borderColor: CHECKLIST_COLOR_SCHEMES[value].icon,
        borderWidth: 2,
      }
    : {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.secondary,
        borderWidth: 1,
      };

  const toggleMenu = () => setVisible(!visible);
  const closeMenu = () => setVisible(false);
  const clearColor = () => {
    onChange(undefined);
    closeMenu();
  };
  const selectColor = (key: keyof typeof CHECKLIST_COLOR_SCHEMES) => {
    onChange(key);
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
          name="palette-outline"
          size={24}
          color={
            value ? CHECKLIST_COLOR_SCHEMES[value].icon : theme.colors.secondary
          }
        />
      </TouchableOpacity>

      <Portal>
        {visible && (
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.backdrop}>
              <Surface
                style={[
                  styles.popover,
                  {
                    backgroundColor: theme.colors.surface,
                    top: height * 0.2,
                    left: 16,
                    right: 16,
                  },
                ]}
              >
                <View style={styles.grid}>
                  {/* Clear option */}
                  <TouchableOpacity
                    style={[
                      styles.circle,
                      {
                        borderColor: !value
                          ? theme.colors.primary
                          : theme.colors.secondary,
                      },
                    ]}
                    onPress={clearColor}
                  >
                    <MaterialCommunityIcons
                      name="invert-colors-off"
                      size={24}
                      color={theme.colors.secondary}
                    />

                    {!value && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={theme.colors.primary}
                        style={styles.circleTick}
                      />
                    )}
                  </TouchableOpacity>

                  {/* Color options */}
                  {Object.entries(CHECKLIST_COLOR_SCHEMES).map(
                    ([key, scheme]) => {
                      const colorKey =
                        key as keyof typeof CHECKLIST_COLOR_SCHEMES;
                      const isSelected = value === colorKey;

                      return (
                        <TouchableOpacity
                          key={colorKey}
                          style={[
                            styles.circle,
                            {
                              backgroundColor: scheme.background,
                              borderColor: theme.colors.secondary,
                            },
                            isSelected && {
                              borderWidth: 2,
                              borderColor: theme.colors.primary,
                            },
                          ]}
                          onPress={() => selectColor(colorKey)}
                        >
                          {isSelected && (
                            <MaterialCommunityIcons
                              name="check-circle"
                              size={20}
                              color={theme.colors.primary}
                              style={styles.circleTick}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    }
                  )}
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
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  triggerTick: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1000,
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
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
    justifyContent: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  circleTick: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});

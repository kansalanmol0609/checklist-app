import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export default function Header({ title, showBack }: HeaderProps) {
  const navigation =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const canGoBack = navigation.canGoBack();

  const shouldShowBack = showBack ?? canGoBack;

  return (
    <Appbar.Header
      style={styles.header}
      statusBarHeight={0} // unify padding across platforms
    >
      {shouldShowBack && (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      )}

      <Appbar.Content
        title={title}
        titleStyle={styles.title}
        style={styles.content}
      />
      <Appbar.Action
        icon="account-circle"
        size={24}
        onPress={() => navigation.navigate('Profile')}
      />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
      default: {
        // Web or other platforms
        elevation: 4,
      },
    }),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    marginLeft: 0, // no left margin difference
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

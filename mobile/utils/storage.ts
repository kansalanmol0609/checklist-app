import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

function setCookie(name: string, value: string, days = 7) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie =
    name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function deleteCookie(name: string) {
  document.cookie = name + '=; Max-Age=0; path=/';
}

export const Storage = {
  async getItemAsync(key: string): Promise<string | null> {
    if (isWeb) {
      return getCookie(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async setItemAsync(key: string, value: string): Promise<void> {
    if (isWeb) {
      setCookie(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async deleteItemAsync(key: string): Promise<void> {
    if (isWeb) {
      deleteCookie(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

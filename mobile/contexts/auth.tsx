// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { Storage } from '@/utils/storage';
import api from '@/api/client';

type User = {
  userId: string;
  email?: string;
  name?: string;
};

interface AuthContextType {
  user: User | null;
  loginWithGoogle: (params: {
    code: string;
    codeVerifier: string;
    redirectUri: string;
    clientId: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    try {
      const { data: userData } = await api.get('/auth/me');
      setUser(userData);
    } catch (error) {
      console.debug('Error fetching user data:', error);

      // invalid token, clear it
      await Storage.deleteItemAsync('accessToken');
    }
  };

  // On mount, try to load existing accessToken and set user
  useEffect(() => {
    getUser();
  }, []);

  const loginWithGoogle: AuthContextType['loginWithGoogle'] = async ({
    code,
    codeVerifier,
    redirectUri,
    clientId,
  }) => {
    // Exchange Google authorization code for our JWT access & refresh tokens
    const { data } = await api.post(
      '/auth/google',
      { code, codeVerifier, redirectUri, clientId },
      { withCredentials: true }
    );

    const { accessToken, refreshToken } = data;

    // Store tokens securely
    await Storage.setItemAsync('accessToken', accessToken);
    await Storage.setItemAsync('refreshToken', refreshToken);

    await getUser();
  };

  const logout = async () => {
    // Invalidate refresh token server-side and clear client storage
    await api.post('/logout', {}, { withCredentials: true });
    await Storage.deleteItemAsync('accessToken');
    await Storage.deleteItemAsync('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

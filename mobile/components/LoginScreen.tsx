import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import * as AuthSession from 'expo-auth-session';
import { useAuth } from '@/contexts/auth';
import { Config } from '@/config';
import { maybeCompleteAuthSession } from 'expo-web-browser';

// This method should be invoked on the page that the auth popup gets redirected to on web,
// it'll ensure that authentication is completed properly. On native this does nothing.
maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'checklistapp',
});

export default function LoginScreen() {
  const { loginWithGoogle } = useAuth();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: Config.googleClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (
      response?.type === 'success' &&
      response.params.code &&
      request?.codeVerifier
    ) {
      loginWithGoogle({
        code: response.params.code,
        codeVerifier: request.codeVerifier,
        redirectUri,
        clientId: Config.googleClientId,
      });
    }
  }, [response, request]);

  // Placeholder login screen
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to Checklist App
      </Text>
      <Text style={styles.subtitle}>Please log in to continue</Text>
      <Button
        mode="contained"
        disabled={!request}
        onPress={() => promptAsync()}
        style={styles.button}
      >
        Log In with Google
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {
    marginBottom: 32,
    color: '#666',
  },
  button: {
    width: '80%',
  },
});

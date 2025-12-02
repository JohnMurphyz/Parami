import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useNotifications } from '../hooks/useNotifications';
import ErrorBoundary from '../components/ErrorBoundary';

// Conditional Sentry import with error handling for React 19 compatibility
let Sentry: typeof import('@sentry/react-native') | null = null;

try {
  Sentry = require('@sentry/react-native');

  // Initialize Sentry with DSN from environment variables (if Sentry loaded successfully)
  const sentryDsn = Constants.expoConfig?.extra?.sentryDsn;

  if (sentryDsn && Sentry) {
    Sentry.init({
      dsn: sentryDsn,
      enableInExpoDevelopment: false,
      debug: false,
      environment: __DEV__ ? 'development' : 'production',
    });
  }
} catch (error) {
  console.warn('Sentry initialization failed (this is expected with React 19):', error);
}

export default function RootLayout() {
  // Initialize notifications
  useNotifications();

  return (
    <ErrorBoundary>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
      </Stack>
    </ErrorBoundary>
  );
}

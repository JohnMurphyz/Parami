import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useNotifications } from '../hooks/useNotifications';
import * as Sentry from '@sentry/react-native';
import ErrorBoundary from '../components/ErrorBoundary';

// Initialize Sentry with DSN from environment variables
const sentryDsn = Constants.expoConfig?.extra?.sentryDsn;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    enableInExpoDevelopment: false,
    debug: false, // Set to true for debugging
    environment: __DEV__ ? 'development' : 'production',
  });
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

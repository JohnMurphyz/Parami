import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useNotifications } from '../hooks/useNotifications';

export default function RootLayout() {
  // Initialize notifications
  useNotifications();

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
      </Stack>
    </>
  );
}

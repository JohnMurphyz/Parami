import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useNotifications } from '../hooks/useNotifications';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { initializeContent } from '../services/firebaseContentService';
import { migrateJournalEntries } from '../services/storageService';
import { logger } from '../utils/logger';

export default function RootLayout() {
  const [contentInitialized, setContentInitialized] = useState(false);

  // Initialize notifications (will wait for content via callback system)
  useNotifications();

  // Initialize Firebase content and migrate data on app launch
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Run migration first to ensure data compatibility
        await migrateJournalEntries();
        logger.info('Journal entries migration complete');

        // Then initialize content
        await initializeContent();
        logger.info('Content initialization complete');
        setContentInitialized(true);
      } catch (error) {
        logger.error('App initialization failed', error);
        // App continues with cached/bundled content
        setContentInitialized(true); // Still set to true so app doesn't hang
      }
    };

    initializeApp();
  }, []);

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

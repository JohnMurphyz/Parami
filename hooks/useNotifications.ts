import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import {
  requestNotificationPermissions,
  scheduleNotification,
  addNotificationResponseListener,
  addNotificationReceivedListener,
} from '../services/notificationService';
import { loadPreferences } from '../services/storageService';
import { logger } from '../utils/logger';

/**
 * Hook to set up notification listeners and initialize notifications
 */
export function useNotifications() {
  const notificationListener = useRef<ReturnType<typeof addNotificationReceivedListener> | undefined>(undefined);
  const responseListener = useRef<ReturnType<typeof addNotificationResponseListener> | undefined>(undefined);

  useEffect(() => {
    // Initialize notifications
    initializeNotifications();

    // Set up notification listeners
    notificationListener.current = addNotificationReceivedListener((notification) => {
      logger.debug('Notification received:', notification);
    });

    responseListener.current = addNotificationResponseListener((response) => {
      logger.debug('Notification tapped:', response);
      // Could navigate to specific screen here if needed
    });

    // Cleanup
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  async function initializeNotifications() {
    try {
      // Load user preferences
      const preferences = await loadPreferences();

      // Request permissions
      const hasPermission = await requestNotificationPermissions();

      if (hasPermission && preferences.notificationsEnabled) {
        // Schedule notification at user's preferred time
        await scheduleNotification(preferences.notificationTime);
      }
    } catch (error) {
      logger.error('Error initializing notifications', error);
    }
  }
}

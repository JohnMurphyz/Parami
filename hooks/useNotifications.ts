import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import {
  requestNotificationPermissions,
  scheduleNotification,
  addNotificationResponseListener,
  addNotificationReceivedListener,
} from '../services/notificationService';
import { loadPreferences } from '../services/storageService';

/**
 * Hook to set up notification listeners and initialize notifications
 */
export function useNotifications() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Initialize notifications
    initializeNotifications();

    // Set up notification listeners
    notificationListener.current = addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    responseListener.current = addNotificationResponseListener((response) => {
      console.log('Notification tapped:', response);
      // Could navigate to specific screen here if needed
    });

    // Cleanup
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
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
      console.error('Error initializing notifications:', error);
    }
  }
}

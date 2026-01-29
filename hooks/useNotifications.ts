import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import {
  requestNotificationPermissions,
  scheduleNotification,
  addNotificationResponseListener,
  addNotificationReceivedListener,
  onContentReady,
} from '../services/notificationService';
import { loadPreferences } from '../services/storageService';
import { isContentReady } from '../services/firebaseContentService';
import { logger } from '../utils/logger';

/**
 * Hook to set up notification listeners and initialize notifications
 */
export function useNotifications() {
  const notificationListener = useRef<ReturnType<typeof addNotificationReceivedListener> | undefined>(undefined);
  const responseListener = useRef<ReturnType<typeof addNotificationResponseListener> | undefined>(undefined);
  const [schedulingAttempted, setSchedulingAttempted] = useState(false);

  useEffect(() => {
    // Set up notification listeners
    notificationListener.current = addNotificationReceivedListener((notification) => {
      logger.debug('Notification received:', notification);
    });

    responseListener.current = addNotificationResponseListener((response) => {
      logger.debug('Notification tapped:', response);
      // Could navigate to specific screen here if needed
    });

    // Initialize notifications with retry logic
    initializeNotifications();

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

      // Only proceed if notifications are enabled
      if (!preferences.notificationsEnabled) {
        logger.info('Notifications disabled in preferences');
        return;
      }

      // Request permissions first
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        logger.info('Notification permissions not granted');
        return;
      }

      // Attempt to schedule immediately if content is ready
      if (isContentReady()) {
        const result = await scheduleNotification(preferences.notificationTime);
        if (result.success) {
          logger.info('Notifications scheduled successfully on init');
          setSchedulingAttempted(true);
        } else {
          logger.warn('Failed to schedule notification on init', result.error);
        }
      } else {
        // Content not ready - register callback for when it becomes ready
        logger.info('Content not ready, waiting for content initialization...');
        onContentReady(async () => {
          if (!schedulingAttempted) {
            logger.info('Content ready, scheduling notifications...');
            const result = await scheduleNotification(preferences.notificationTime);
            if (result.success) {
              logger.info('Notifications scheduled successfully after content ready');
              setSchedulingAttempted(true);
            } else {
              logger.error('Failed to schedule notification after content ready', result.error);
            }
          }
        });
      }
    } catch (error) {
      logger.error('Error initializing notifications', error);
    }
  }
}

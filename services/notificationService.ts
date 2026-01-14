import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getTodayParamiId } from './storageService';
import { getParamiById } from './firebaseContentService';
import { logger } from '../utils/logger';

// Configure how notifications should be handled when app is in foreground
// This handler fetches current Parami dynamically to ensure accuracy
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // Update notification content with current Parami before displaying
    try {
      const currentParamiId = await getTodayParamiId();
      const currentParami = getParamiById(currentParamiId);

      if (currentParami) {
        // Override notification content with current Parami
        notification.request.content.title = `Today's Parami: ${currentParami.englishName}`;
        notification.request.content.body = currentParami.shortDescription;
        notification.request.content.data = { paramiId: currentParamiId };
      }
    } catch (error) {
      logger.error('Error updating notification content in handler', error);
    }

    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

/**
 * Request notification permissions from the user
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      logger.info('Notification permissions not granted');
      return false;
    }

    // Android-specific: Create notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-parami', {
        name: 'Daily Parami',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#8B4513',
        sound: 'default',
      });
    }

    return true;
  } catch (error) {
    logger.error('Error requesting notification permissions', error);
    return false;
  }
}

/**
 * Schedule a daily notification at the specified time
 */
export async function scheduleNotification(time: string = '09:00'): Promise<void> {
  try {
    // Request permissions first
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      logger.info('Cannot schedule notification without permission');
      return;
    }

    // Cancel any existing notifications
    await cancelAllNotifications();

    // Parse the time (format: "HH:MM")
    const [hours, minutes] = time.split(':').map(Number);

    // Get today's Parami for the notification
    const todayParamiId = await getTodayParamiId();
    const parami = getParamiById(todayParamiId);

    if (!parami) {
      logger.error('Could not find Parami for notification');
      return;
    }

    // Schedule daily repeating notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Today's Parami: ${parami.englishName}`,
        body: parami.shortDescription,
        data: { paramiId: todayParamiId },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });

    logger.info(`Notification scheduled for ${time} daily`);
  } catch (error) {
    logger.error('Error scheduling notification', error);
    throw error;
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    logger.info('All notifications cancelled');
  } catch (error) {
    logger.error('Error cancelling notifications', error);
    throw error;
  }
}

/**
 * Add listener for when user taps on a notification
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Add listener for when notification is received while app is foregrounded
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Update notification with current Parami information
 * Should be called when Parami changes or on app launch
 */
export async function updateNotificationContent(notificationTime: string = '09:00'): Promise<void> {
  try {
    // Get current Parami
    const todayParamiId = await getTodayParamiId();
    const parami = getParamiById(todayParamiId);

    if (!parami) {
      logger.error('Could not find Parami for notification update');
      return;
    }

    // Reschedule notification with updated content
    await scheduleNotification(notificationTime);

    logger.info(`Notification content updated for Parami: ${parami.englishName}`);
  } catch (error) {
    logger.error('Error updating notification content', error);
  }
}

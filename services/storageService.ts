import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, STORAGE_KEYS } from '../types';
import {
  initializeQueue,
  getNextParamiFromQueue,
  shouldRefreshForNewDay,
} from '../utils/paramiShuffle';
import { logger } from '../utils/logger';
import { getLocalDateString, toLocalDateString } from '../utils/dateUtils';

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  notificationTime: '09:00',
  notificationsEnabled: true,
  firstLaunchDate: new Date().toISOString(),
};

/**
 * Load user preferences from AsyncStorage
 */
export async function loadPreferences(): Promise<UserPreferences> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);

    if (data) {
      return JSON.parse(data);
    }

    // First time - save defaults
    await savePreferences(DEFAULT_PREFERENCES);
    return DEFAULT_PREFERENCES;
  } catch (error) {
    logger.error('Error loading preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save user preferences to AsyncStorage
 */
export async function savePreferences(
  preferences: UserPreferences
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PREFERENCES,
      JSON.stringify(preferences)
    );
  } catch (error) {
    logger.error('Error saving preferences:', error);
    throw error;
  }
}

/**
 * Update a specific preference field
 */
export async function updatePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): Promise<void> {
  try {
    const preferences = await loadPreferences();
    preferences[key] = value;
    await savePreferences(preferences);
  } catch (error) {
    logger.error('Error updating preference:', error);
    throw error;
  }
}

/**
 * Update wizard completion tracking
 */
export async function updateWizardCompletion(
  paramiId: number,
  date: string = new Date().toISOString()
): Promise<void> {
  try {
    const preferences = await loadPreferences();
    preferences.lastViewedDate = date;
    preferences.lastViewedParamiId = paramiId;
    await savePreferences(preferences);
  } catch (error) {
    logger.error('Error updating wizard completion:', error);
    throw error;
  }
}

/**
 * Check if wizard should be shown (new day or new Parami)
 */
export async function shouldShowWizard(currentParamiId: number): Promise<boolean> {
  try {
    const preferences = await loadPreferences();
    const today = getLocalDateString();
    const lastViewed = preferences.lastViewedDate
      ? toLocalDateString(preferences.lastViewedDate)
      : null;

    // Show wizard if no last viewed date, or if date/Parami has changed
    return (
      !lastViewed ||
      lastViewed !== today ||
      preferences.lastViewedParamiId !== currentParamiId
    );
  } catch (error) {
    logger.error('Error checking wizard status:', error);
    return true; // Show wizard on error to be safe
  }
}

/**
 * Save custom practice for a specific Parami
 */
export async function saveCustomPractice(
  paramiId: number,
  practice: string
): Promise<void> {
  try {
    const preferences = await loadPreferences();
    if (!preferences.customPractices) {
      preferences.customPractices = {};
    }
    preferences.customPractices[paramiId] = practice;
    await savePreferences(preferences);
  } catch (error) {
    logger.error('Error saving custom practice:', error);
    throw error;
  }
}

/**
 * Get custom practice for a specific Parami
 */
export async function getCustomPractice(
  paramiId: number
): Promise<string | undefined> {
  try {
    const preferences = await loadPreferences();
    return preferences.customPractices?.[paramiId];
  } catch (error) {
    logger.error('Error getting custom practice:', error);
    return undefined;
  }
}

/**
 * Clear all stored data (useful for testing/debugging)
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    logger.error('Error clearing data:', error);
    throw error;
  }
}

/**
 * Get today's Parami ID using the shuffled queue system
 * Automatically advances the queue for new days
 */
export async function getTodayParamiId(): Promise<number> {
  try {
    const preferences = await loadPreferences();

    // Initialize queue if it doesn't exist
    if (!preferences.paramiQueue || !preferences.queuePosition) {
      const { queue, position } = initializeQueue();
      const paramiId = queue[position];

      preferences.paramiQueue = queue;
      preferences.queuePosition = position + 1;
      preferences.lastQueueRefreshDate = new Date().toISOString();

      await savePreferences(preferences);
      return paramiId;
    }

    // Check if we need to advance for a new day
    if (shouldRefreshForNewDay(preferences.lastQueueRefreshDate)) {
      const { paramiId, newQueue, newPosition } = getNextParamiFromQueue(
        preferences.paramiQueue,
        preferences.queuePosition
      );

      preferences.paramiQueue = newQueue;
      preferences.queuePosition = newPosition;
      preferences.lastQueueRefreshDate = new Date().toISOString();

      await savePreferences(preferences);
      return paramiId;
    }

    // Return current day's Parami (already advanced)
    const currentIndex = preferences.queuePosition - 1;
    return preferences.paramiQueue[currentIndex];
  } catch (error) {
    logger.error('Error getting today\'s Parami ID:', error);
    // Fallback to a safe default
    return 1;
  }
}

/**
 * Manually shuffle to the next Parami (for the shuffle button)
 * This advances the queue immediately
 */
export async function shuffleToNextParami(): Promise<number> {
  try {
    const preferences = await loadPreferences();

    // Initialize queue if it doesn't exist
    if (!preferences.paramiQueue || preferences.queuePosition === undefined) {
      const { queue, position } = initializeQueue();
      preferences.paramiQueue = queue;
      preferences.queuePosition = position;
    }

    // Get next Parami from queue
    const { paramiId, newQueue, newPosition } = getNextParamiFromQueue(
      preferences.paramiQueue,
      preferences.queuePosition
    );

    preferences.paramiQueue = newQueue;
    preferences.queuePosition = newPosition;
    // Don't update lastQueueRefreshDate - manual shuffle doesn't affect daily rotation

    await savePreferences(preferences);
    return paramiId;
  } catch (error) {
    logger.error('Error shuffling to next Parami:', error);
    throw error;
  }
}

/**
 * Get checked practice IDs for a specific Parami
 */
export async function getCheckedPractices(paramiId: number): Promise<string[]> {
  try {
    const preferences = await loadPreferences();
    return preferences.checkedPractices?.[paramiId] || [];
  } catch (error) {
    logger.error('Error getting checked practices:', error);
    return [];
  }
}

/**
 * Toggle a practice's checked state for a specific Parami
 */
export async function togglePracticeChecked(
  paramiId: number,
  practiceId: string
): Promise<void> {
  try {
    const preferences = await loadPreferences();

    if (!preferences.checkedPractices) {
      preferences.checkedPractices = {};
    }

    if (!preferences.checkedPractices[paramiId]) {
      preferences.checkedPractices[paramiId] = [];
    }

    const checkedList = preferences.checkedPractices[paramiId];
    const index = checkedList.indexOf(practiceId);

    if (index > -1) {
      // Already checked - uncheck it
      checkedList.splice(index, 1);
    } else {
      // Not checked - check it
      checkedList.push(practiceId);
    }

    await savePreferences(preferences);
  } catch (error) {
    logger.error('Error toggling practice checked:', error);
    throw error;
  }
}

/**
 * Clear all checked practices for a specific Parami
 */
export async function clearCheckedPracticesForParami(
  paramiId: number
): Promise<void> {
  try {
    const preferences = await loadPreferences();

    if (preferences.checkedPractices && preferences.checkedPractices[paramiId]) {
      delete preferences.checkedPractices[paramiId];
      await savePreferences(preferences);
    }
  } catch (error) {
    logger.error('Error clearing checked practices:', error);
    throw error;
  }
}

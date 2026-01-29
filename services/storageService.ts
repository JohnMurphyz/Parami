import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, STORAGE_KEYS, JournalEntry, Favorite, HistoryEntry, QuizResult, QuizResponse } from '../types';
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

    // Update history when practice is checked
    await updateHistoryEntry(paramiId);
  } catch (error) {
    logger.error('Error toggling practice checked:', error);
    throw error;
  }
}

// ============================================================================
// JOURNAL ENTRIES
// ============================================================================

/**
 * Load all journal entries
 */
export async function loadJournalEntries(): Promise<JournalEntry[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logger.error('Error loading journal entries:', error);
    return [];
  }
}

/**
 * Save journal entry
 */
export async function saveJournalEntry(
  paramiId: number,
  content: string
): Promise<JournalEntry> {
  try {
    const entries = await loadJournalEntries();
    const today = getLocalDateString();
    const now = new Date().toISOString();

    // Check if entry exists for today and this Parami
    const existingIndex = entries.findIndex(
      (e) => e.date === today && e.paramiId === paramiId
    );

    let entry: JournalEntry;

    if (existingIndex > -1) {
      // Update existing entry
      entry = {
        ...entries[existingIndex],
        content,
        updatedAt: now,
      };
      entries[existingIndex] = entry;
    } else {
      // Create new entry
      entry = {
        id: `journal_${now}_${paramiId}`,
        paramiId,
        date: today,
        content,
        createdAt: now,
        updatedAt: now,
      };
      entries.push(entry);
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.JOURNAL_ENTRIES,
      JSON.stringify(entries)
    );

    // Update history
    await updateHistoryEntry(paramiId);

    return entry;
  } catch (error) {
    logger.error('Error saving journal entry:', error);
    throw error;
  }
}

/**
 * Get journal entry for a specific date and Parami
 */
export async function getJournalEntry(
  paramiId: number,
  date?: string
): Promise<JournalEntry | undefined> {
  try {
    const entries = await loadJournalEntries();
    const targetDate = date || getLocalDateString();
    return entries.find((e) => e.date === targetDate && e.paramiId === paramiId);
  } catch (error) {
    logger.error('Error getting journal entry:', error);
    return undefined;
  }
}

/**
 * Delete journal entry
 */
export async function deleteJournalEntry(entryId: string): Promise<void> {
  try {
    const entries = await loadJournalEntries();
    const filtered = entries.filter((e) => e.id !== entryId);
    await AsyncStorage.setItem(
      STORAGE_KEYS.JOURNAL_ENTRIES,
      JSON.stringify(filtered)
    );
  } catch (error) {
    logger.error('Error deleting journal entry:', error);
    throw error;
  }
}

// ============================================================================
// FAVORITES
// ============================================================================

/**
 * Load all favorites
 */
export async function loadFavorites(): Promise<Favorite[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logger.error('Error loading favorites:', error);
    return [];
  }
}

/**
 * Add item to favorites
 */
export async function addToFavorites(
  type: 'practice' | 'quote',
  paramiId: number,
  itemId: string
): Promise<Favorite> {
  try {
    const favorites = await loadFavorites();
    const now = new Date().toISOString();

    const favorite: Favorite = {
      id: `favorite_${now}_${type}_${itemId}`,
      type,
      paramiId,
      itemId,
      addedAt: now,
    };

    favorites.push(favorite);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));

    return favorite;
  } catch (error) {
    logger.error('Error adding to favorites:', error);
    throw error;
  }
}

/**
 * Remove item from favorites
 */
export async function removeFromFavorites(favoriteId: string): Promise<void> {
  try {
    const favorites = await loadFavorites();
    const filtered = favorites.filter((f) => f.id !== favoriteId);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
  } catch (error) {
    logger.error('Error removing from favorites:', error);
    throw error;
  }
}

/**
 * Check if item is favorited
 */
export async function isFavorited(
  type: 'practice' | 'quote',
  itemId: string
): Promise<boolean> {
  try {
    const favorites = await loadFavorites();
    return favorites.some((f) => f.type === type && f.itemId === itemId);
  } catch (error) {
    logger.error('Error checking if favorited:', error);
    return false;
  }
}

/**
 * Get favorite by type and item ID
 */
export async function getFavorite(
  type: 'practice' | 'quote',
  itemId: string
): Promise<Favorite | undefined> {
  try {
    const favorites = await loadFavorites();
    return favorites.find((f) => f.type === type && f.itemId === itemId);
  } catch (error) {
    logger.error('Error getting favorite:', error);
    return undefined;
  }
}

// ============================================================================
// HISTORY & STREAKS
// ============================================================================

/**
 * Load all history entries
 */
export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logger.error('Error loading history:', error);
    return [];
  }
}

/**
 * Update or create history entry for today
 */
export async function updateHistoryEntry(paramiId: number): Promise<void> {
  try {
    const history = await loadHistory();
    const today = getLocalDateString();
    const now = new Date().toISOString();

    const existingIndex = history.findIndex((h) => h.date === today);
    const preferences = await loadPreferences();
    const practicesCompleted = preferences.checkedPractices?.[paramiId] || [];
    const journalEntries = await loadJournalEntries();
    const hasJournalEntry = journalEntries.some(
      (j) => j.date === today && j.paramiId === paramiId
    );

    if (existingIndex > -1) {
      // Update existing entry
      history[existingIndex] = {
        ...history[existingIndex],
        practicesCompleted,
        hasJournalEntry,
      };
    } else {
      // Create new entry
      const entry: HistoryEntry = {
        date: today,
        paramiId,
        practicesCompleted,
        hasJournalEntry,
        visitedAt: now,
      };
      history.push(entry);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

    // Update streak
    await updateStreak();
  } catch (error) {
    logger.error('Error updating history entry:', error);
    throw error;
  }
}

/**
 * Calculate and update user's streak
 */
export async function updateStreak(): Promise<void> {
  try {
    const preferences = await loadPreferences();
    const history = await loadHistory();
    const today = getLocalDateString();

    // Sort history by date descending
    const sortedHistory = history.sort((a, b) => b.date.localeCompare(a.date));

    let currentStreak = 0;
    let checkDate = new Date();

    // Count consecutive days from today backwards
    for (let i = 0; i < sortedHistory.length; i++) {
      const expectedDate = toLocalDateString(checkDate);
      const entry = sortedHistory.find((h) => h.date === expectedDate);

      if (entry) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Update preferences
    preferences.currentStreak = currentStreak;
    preferences.longestStreak = Math.max(
      currentStreak,
      preferences.longestStreak || 0
    );
    preferences.lastVisitDate = today;

    await savePreferences(preferences);
  } catch (error) {
    logger.error('Error updating streak:', error);
    throw error;
  }
}

/**
 * Get current streak
 */
export async function getCurrentStreak(): Promise<number> {
  try {
    const preferences = await loadPreferences();
    return preferences.currentStreak || 0;
  } catch (error) {
    logger.error('Error getting current streak:', error);
    return 0;
  }
}

/**
 * Get longest streak
 */
export async function getLongestStreak(): Promise<number> {
  try {
    const preferences = await loadPreferences();
    return preferences.longestStreak || 0;
  } catch (error) {
    logger.error('Error getting longest streak:', error);
    return 0;
  }
}

// ==========================================
// The Crossing Over Diagnostic Results
// ==========================================

/**
 * Load all quiz results
 */
export async function loadQuizResults(): Promise<QuizResult[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logger.error('Error loading quiz results:', error);
    return [];
  }
}

/**
 * Save a new quiz result
 */
export async function saveQuizResult(responses: QuizResponse[]): Promise<QuizResult> {
  try {
    const results = await loadQuizResults();
    const now = new Date().toISOString();
    const today = getLocalDateString();

    // Calculate scores using the scoring utility
    const { calculateAllScores } = await import('../utils/quizScoring');
    const scores = calculateAllScores(responses);

    const newResult: QuizResult = {
      id: `quiz_${now}`,
      date: today,
      completedAt: now,
      responses,
      scores,
    };

    results.push(newResult);

    await AsyncStorage.setItem(
      STORAGE_KEYS.QUIZ_RESULTS,
      JSON.stringify(results)
    );

    // Update preferences
    await updatePreference('hasCompletedDiagnosticQuiz', true);
    await updatePreference('lastQuizDate', today);

    logger.info('Quiz result saved successfully:', newResult.id);
    return newResult;
  } catch (error) {
    logger.error('Error saving quiz result:', error);
    throw error;
  }
}

/**
 * Get most recent quiz result
 */
export async function getMostRecentQuizResult(): Promise<QuizResult | undefined> {
  try {
    const results = await loadQuizResults();
    if (results.length === 0) return undefined;

    return results.sort((a, b) =>
      b.completedAt.localeCompare(a.completedAt)
    )[0];
  } catch (error) {
    logger.error('Error getting recent quiz result:', error);
    return undefined;
  }
}

/**
 * Get quiz result by ID
 */
export async function getQuizResultById(id: string): Promise<QuizResult | undefined> {
  try {
    const results = await loadQuizResults();
    return results.find((r) => r.id === id);
  } catch (error) {
    logger.error('Error getting quiz result by ID:', error);
    return undefined;
  }
}

/**
 * Delete a quiz result by ID
 */
export async function deleteQuizResult(id: string): Promise<void> {
  try {
    const results = await loadQuizResults();
    const filtered = results.filter((r) => r.id !== id);
    await AsyncStorage.setItem(
      STORAGE_KEYS.QUIZ_RESULTS,
      JSON.stringify(filtered)
    );
    logger.info('Quiz result deleted:', id);
  } catch (error) {
    logger.error('Error deleting quiz result:', error);
    throw error;
  }
}

// ============================================================================
// STRUCTURED REFLECTIONS
// ============================================================================

/**
 * Migrate existing journal entries to add type discriminator
 * Run this once on app update to tag existing entries as 'unstructured'
 */
export async function migrateJournalEntries(): Promise<void> {
  try {
    const existing = await loadJournalEntries();

    // Check if migration already happened (first entry has type field)
    if (existing.length > 0 && 'type' in existing[0]) {
      logger.info('Journal entries already migrated');
      return;
    }

    const migrated = existing.map((entry: any) => ({
      ...entry,
      type: 'unstructured' as const,
    }));

    await AsyncStorage.setItem(
      STORAGE_KEYS.JOURNAL_ENTRIES,
      JSON.stringify(migrated)
    );

    logger.info('Migrated journal entries to include type discriminator');
  } catch (error) {
    logger.error('Error migrating journal entries', error);
    throw error;
  }
}

/**
 * Load all structured reflections
 */
export async function loadStructuredReflections(): Promise<import('../types').StructuredReflection[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STRUCTURED_REFLECTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logger.error('Error loading structured reflections', error);
    return [];
  }
}

/**
 * Save or update a structured reflection
 * Supports partial saves (resume later)
 */
export async function saveStructuredReflection(
  reflection: import('../types').StructuredReflection
): Promise<import('../types').StructuredReflection> {
  try {
    const all = await loadStructuredReflections();
    const existingIndex = all.findIndex((r) => r.id === reflection.id);

    const updated = {
      ...reflection,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      all[existingIndex] = updated;
      logger.info('Updated structured reflection', { id: reflection.id });
    } else {
      all.push(updated);
      logger.info('Created new structured reflection', { id: reflection.id });
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.STRUCTURED_REFLECTIONS,
      JSON.stringify(all)
    );

    // Update history entry to mark hasJournalEntry
    await updateHistoryEntry(reflection.paramiId);

    return updated;
  } catch (error) {
    logger.error('Error saving structured reflection', error);
    throw error;
  }
}

/**
 * Get today's structured reflection (or create new one)
 */
export async function getTodayReflection(
  paramiId: number
): Promise<import('../types').StructuredReflection> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const all = await loadStructuredReflections();
    const existing = all.find((r) => r.date === today && r.paramiId === paramiId);

    if (existing) {
      logger.info('Found existing reflection for today', { id: existing.id });
      return existing;
    }

    // Create new structured reflection
    const newReflection: import('../types').StructuredReflection = {
      id: `structured_${Date.now()}_${paramiId}`,
      type: 'structured',
      paramiId,
      date: today,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedSections: {
        egoAudit: false,
        gardenLog: false,
        nutrimentAudit: false,
        vicissitudes: false,
        disappointment: false,
      },
      dailyPrompts: {
        selfReliance: '',
        nowness: '',
        nonAttachment: '',
        clarity: '',
      },
      emotionalState: 'peaceful',
      resilienceLevel: 'stable',
      overallReflection: '',
    };

    logger.info('Created new reflection for today', { id: newReflection.id });
    return newReflection;
  } catch (error) {
    logger.error('Error getting today reflection', error);
    throw error;
  }
}

/**
 * Load all reflection entries (both structured and unstructured)
 */
export async function loadAllReflectionEntries(): Promise<import('../types').ReflectionEntry[]> {
  try {
    const [structured, unstructured] = await Promise.all([
      loadStructuredReflections(),
      loadJournalEntries(),
    ]);

    // Combine and sort by date (most recent first)
    const all: import('../types').ReflectionEntry[] = [...structured, ...unstructured];
    return all.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    logger.error('Error loading all reflection entries', error);
    return [];
  }
}

/**
 * Get structured reflection by ID
 */
export async function getStructuredReflectionById(
  id: string
): Promise<import('../types').StructuredReflection | undefined> {
  try {
    const reflections = await loadStructuredReflections();
    return reflections.find((r) => r.id === id);
  } catch (error) {
    logger.error('Error getting structured reflection by ID', error);
    return undefined;
  }
}

/**
 * Delete a structured reflection by ID
 */
export async function deleteStructuredReflection(id: string): Promise<void> {
  try {
    const reflections = await loadStructuredReflections();
    const filtered = reflections.filter((r) => r.id !== id);
    await AsyncStorage.setItem(
      STORAGE_KEYS.STRUCTURED_REFLECTIONS,
      JSON.stringify(filtered)
    );
    logger.info('Structured reflection deleted', { id });
  } catch (error) {
    logger.error('Error deleting structured reflection', error);
    throw error;
  }
}


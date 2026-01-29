// Core Parami data structure
export interface Parami {
  id: number; // 1-10
  name: string; // Pali name (e.g., "Dana")
  englishName: string; // English translation (e.g., "Generosity")
  shortDescription: string; // One sentence summary
  fullDescription: string; // 2-3 paragraph explanation
  story: string; // Narrative/teaching story
  quote: Quote; // Featured quote
  practices: Practice[]; // Daily practice suggestions
}

// Quote structure
export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string; // Optional book/sutra reference
}

// Practice suggestion structure
export interface Practice {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'challenging';
  context: 'work' | 'home' | 'relationships' | 'personal' | 'any';
}

// Journal entry structure
export interface JournalEntry {
  id: string; // unique ID
  paramiId: number; // Associated Parami (1-10)
  date: string; // ISO date string
  content: string; // Journal text
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Favorite item (practice or quote)
export interface Favorite {
  id: string; // unique ID
  type: 'practice' | 'quote';
  paramiId: number; // Associated Parami (1-10)
  itemId: string; // Practice ID or Quote ID
  addedAt: string; // ISO timestamp
}

// Daily history entry
export interface HistoryEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  paramiId: number; // Which Parami was shown (1-10)
  practicesCompleted: string[]; // Practice IDs completed that day
  hasJournalEntry: boolean; // Whether user wrote a journal entry
  visitedAt: string; // ISO timestamp of first visit that day
}

// User preferences stored in AsyncStorage
export interface UserPreferences {
  notificationTime: string; // "09:00" format
  notificationsEnabled: boolean;
  firstLaunchDate: string; // ISO date string
  lastViewedDate?: string; // ISO date of last wizard completion
  lastViewedParamiId?: number; // Parami ID from last view
  customPractices?: Record<number, string>; // User's custom practices by Parami ID
  paramiQueue?: number[]; // Shuffled queue of Parami IDs (1-10)
  queuePosition?: number; // Current position in queue
  lastQueueRefreshDate?: string; // ISO date of last daily rotation
  hasCompletedOnboarding?: boolean; // Whether user has completed first-launch onboarding
  checkedPractices?: Record<number, string[]>; // Checked practice IDs by Parami ID
  currentStreak?: number; // Current daily streak
  longestStreak?: number; // Longest streak achieved
  lastVisitDate?: string; // ISO date string of last app visit (for streak tracking)
  hasCompletedDiagnosticQuiz?: boolean; // Whether user has completed The Crossing Over Diagnostic
  lastQuizDate?: string; // ISO date string of last diagnostic completion
}

// Firebase content metadata
export interface ContentMetadata {
  version: number; // Increment on each content update
  lastUpdated: string; // ISO timestamp
  publishedBy?: string; // Admin email (optional)
  minAppVersion?: string; // Minimum app version required (optional)
}

// Content cache structure stored in AsyncStorage
export interface ContentCache {
  version: number; // Content version number
  lastFetched: string; // ISO timestamp of last successful fetch
  paramis: Parami[]; // All 10 Paramis
  expandedPractices: Record<number, Practice[]>; // Expanded practices by Parami ID
  metadata?: ContentMetadata; // Optional metadata
}

// Quiz question structure
export interface QuizQuestion {
  id: number; // 1-10 (maps to parami ID)
  paramiName: string; // Pali name (e.g., "Dāna")
  englishName: string; // English translation (e.g., "Generosity")
  strengthStatement: string;
  weaknessStatement: string;
}

// Individual question response
export interface QuizResponse {
  paramiId: number;
  strengthRating: number; // 1-5
  weaknessRating: number; // 1-5
}

// Calculated score for a parami
export interface ParamiScore {
  paramiId: number;
  strengthRating: number; // 1-5
  weaknessRating: number; // 1-5
  normalizedScore: number; // 0-100 (calculated)
}

// Complete quiz result
export interface QuizResult {
  id: string; // unique ID (timestamp-based)
  date: string; // ISO date string (YYYY-MM-DD)
  completedAt: string; // ISO timestamp
  responses: QuizResponse[]; // All 10 responses
  scores: ParamiScore[]; // Calculated scores
}

// Storage keys
export const STORAGE_KEYS = {
  PREFERENCES: '@parami_app:preferences',
  CONTENT_CACHE: '@parami_app:content_cache',
  JOURNAL_ENTRIES: '@parami_app:journal_entries',
  FAVORITES: '@parami_app:favorites',
  HISTORY: '@parami_app:history',
  QUIZ_RESULTS: '@parami_app:quiz_results',
} as const;

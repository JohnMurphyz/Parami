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
}

// Storage keys
export const STORAGE_KEYS = {
  PREFERENCES: '@parami_app:preferences',
} as const;

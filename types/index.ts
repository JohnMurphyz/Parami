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

// Journal entry structure (legacy/unstructured entries)
export interface JournalEntry {
  id: string; // unique ID
  type: 'unstructured'; // Discriminator for entry type
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
  reflectionMode?: 'simplified' | 'detailed'; // Reflection mode preference (default: 'simplified')
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

// ============================================================================
// Structured Reflection System Types
// ============================================================================

// Emotional/Sentiment Tracking
export type EmotionalState = 'peaceful' | 'grateful' | 'challenged' | 'restless' | 'discouraged';
export type ResilienceLevel = 'stable' | 'wavering' | 'struggling';

// Ego Audit Section - Unmasking Self-Deception
export interface EgoAuditResponse {
  lordsOfMaterialism: {
    lordOfForm: boolean;        // Seeking neurotic comfort
    lordOfSpeech: boolean;      // Using intellect as shield
    lordOfMind: boolean;        // Using spirituality to feel special
    notes: string;              // Additional notes on which lords appeared
  };
  spiritualAdvisor: string;     // Rationalizations caught today
  areYouSure: string;           // Perception challenges
}

// Garden Log Section - Selective Watering
export interface GardenLogResponse {
  wholesomeSeeds: string[];     // e.g., ['generosity', 'patience', 'mindfulness']
  unwholesomeSeeds: string[];   // e.g., ['anger', 'jealousy', 'craving']
  changingThePeg: string;       // Moments of thought replacement
  helloHabitEnergy: string;     // "Mere recognition" moments
}

// Nutriment Audit Section - Mental Diet Tracking
export interface NutrimentAuditResponse {
  edibleFood: {
    wasMindful: boolean;
    notes: string;
  };
  senseImpressions: {
    toxicMedia: string[];       // What toxic content consumed
    impact: string;             // How it affected you
  };
  intention: {
    deepDesire: string;         // What drove you today
    selfOrOthers: 'self' | 'others' | 'both';
  };
  collectiveEnergy: string;     // What energies influenced you
}

// Vicissitudes Section - Resilience Tracking (8 Worldly Conditions)
export interface VicissitudesResponse {
  worldlyConditions: {
    gain?: { occurred: boolean; reaction: string; };
    loss?: { occurred: boolean; reaction: string; };
    fame?: { occurred: boolean; reaction: string; };
    disrepute?: { occurred: boolean; reaction: string; };
    praise?: { occurred: boolean; reaction: string; };
    blame?: { occurred: boolean; reaction: string; };
    pleasure?: { occurred: boolean; reaction: string; };
    pain?: { occurred: boolean; reaction: string; };
  };
  secondArrow: {
    occurred: boolean;
    description: string;        // What second arrow did you add
  };
}

// Disappointment Section - Landing on Hard Ground
export interface DisappointmentResponse {
  practiceFeltTedious: boolean;
  hardGroundMoments: string;    // Times you landed on hard ground
  softLandingAttempts: string;  // Times you sought spiritual fantasy
}

// Complete Structured Reflection
export interface StructuredReflection {
  id: string;                   // Format: structured_${timestamp}_${paramiId}
  type: 'structured';           // Discriminator
  paramiId: number;
  date: string;                 // ISO date (YYYY-MM-DD)
  createdAt: string;            // ISO timestamp
  updatedAt: string;            // ISO timestamp

  // Completion tracking
  completedSections: {
    egoAudit: boolean;
    gardenLog: boolean;
    nutrimentAudit: boolean;
    vicissitudes: boolean;
    disappointment: boolean;
  };

  // The Five Sections
  egoAudit?: EgoAuditResponse;
  gardenLog?: GardenLogResponse;
  nutrimentAudit?: NutrimentAuditResponse;
  vicissitudes?: VicissitudesResponse;
  disappointment?: DisappointmentResponse;

  // Fixed Daily Prompts Responses
  dailyPrompts: {
    selfReliance: string;       // "Did I act as my own master..."
    nowness: string;            // "How many times did I stop the horse..."
    nonAttachment: string;      // "Which cows did I release..."
    clarity: string;            // "Did I look at my mind like a mirror..."
  };

  // Emotional/Sentiment Tracking
  emotionalState: EmotionalState;
  resilienceLevel: ResilienceLevel;
  overallReflection: string;    // Summary/closing thoughts
}

// Import simplified reflection types
import { SimplifiedReflection } from './simplifiedReflection';

// Union type for all entries
export type ReflectionEntry = SimplifiedReflection | StructuredReflection | JournalEntry;

// Storage keys
export const STORAGE_KEYS = {
  PREFERENCES: '@parami_app:preferences',
  CONTENT_CACHE: '@parami_app:content_cache',
  JOURNAL_ENTRIES: '@parami_app:journal_entries',
  STRUCTURED_REFLECTIONS: '@parami_app:structured_reflections',
  FAVORITES: '@parami_app:favorites',
  HISTORY: '@parami_app:history',
  QUIZ_RESULTS: '@parami_app:quiz_results',
} as const;

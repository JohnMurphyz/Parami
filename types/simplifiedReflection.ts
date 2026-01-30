// ============================================================================
// Simplified Reflection System Types (3-Section Flow)
// ============================================================================

import { EmotionalState, ResilienceLevel } from './index';

// Life experience categories (simplified from 8 Worldly Conditions)
export type LifeExperience = 'gain-loss' | 'praise-blame' | 'pleasure-pain' | 'success-failure';

// Section 1: Mind & Intention Response
export interface MindIntentionResponse {
  // Three Lords of Materialism (preserved for analytics)
  lordsOfMaterialism: {
    lordOfForm: boolean;        // Seeking neurotic comfort
    lordOfSpeech: boolean;      // Using intellect as shield
    lordOfMind: boolean;        // Using spirituality to feel special
  };

  // Merged: Spiritual Advisor + Are You Sure + Lords Notes
  patternsNoticed: string;

  // Garden Log (preserved for analytics)
  wholesomeSeeds: string[];     // e.g., ['generosity', 'patience', 'compassion']
  unwholesomeSeeds: string[];   // e.g., ['anger', 'jealousy', 'craving']

  // Merged: Changing the Peg + Hello Habit Energy
  patternResponse: string;
}

// Section 2: Experience & Response
export interface ExperienceResponseData {
  // Simplified worldly conditions (4 pairs instead of 8 individual)
  lifeExperiences: {
    selected: LifeExperience[];
    description: string;        // Optional description of what happened
  };

  // Second Arrow (preserved for analytics)
  secondArrow: {
    occurred: boolean;
    description: string;        // Description of the second arrow added
  };

  // Merged: Hard Ground + Soft Landing + Practice Tedious
  hardGroundReflection: string;

  // Simplified: Media consumption (from Nutriment Audit)
  mentalConsumption: string;    // What media/conversations affected your mind
}

// Section 3: Reflection & Integration
export interface ReflectionIntegrationData {
  // Simplified daily contemplations (2 instead of 4)
  essentialQuestions: {
    presence: string;           // Merged: Nowness + Clarity
    lettingGo: string;          // Merged: Non-Attachment + Self-Reliance
  };

  // Emotional tracking (preserved for analytics)
  emotionalState: EmotionalState;
  resilienceLevel: ResilienceLevel;

  // Overall synthesis
  overallReflection: string;
}

// Main Simplified Reflection Structure
export interface SimplifiedReflection {
  id: string;                   // Format: simplified_${timestamp}_${paramiId}
  type: 'simplified';           // Discriminator
  paramiId: number;             // Associated Parami (1-10)
  date: string;                 // ISO date (YYYY-MM-DD)
  createdAt: string;            // ISO timestamp
  updatedAt: string;            // ISO timestamp

  // Completion tracking for 3 sections
  completedSections: {
    mindIntention: boolean;
    experienceResponse: boolean;
    reflectionIntegration: boolean;
  };

  // Section data (optional until completed)
  mindIntention?: MindIntentionResponse;
  experienceResponse?: ExperienceResponseData;
  reflectionIntegration?: ReflectionIntegrationData;
}

// Type guard to check if a reflection is simplified
export function isSimplifiedReflection(reflection: any): reflection is SimplifiedReflection {
  return reflection && reflection.type === 'simplified';
}

// Helper to create empty simplified reflection
export function createEmptySimplifiedReflection(paramiId: number): SimplifiedReflection {
  const now = new Date().toISOString();
  const dateOnly = now.split('T')[0];
  const timestamp = Date.now();

  return {
    id: `simplified_${timestamp}_${paramiId}`,
    type: 'simplified',
    paramiId,
    date: dateOnly,
    createdAt: now,
    updatedAt: now,
    completedSections: {
      mindIntention: false,
      experienceResponse: false,
      reflectionIntegration: false,
    },
    reflectionIntegration: {
      essentialQuestions: {
        presence: '',
        lettingGo: '',
      },
      emotionalState: 'peaceful',
      resilienceLevel: 'stable',
      overallReflection: '',
    },
  };
}

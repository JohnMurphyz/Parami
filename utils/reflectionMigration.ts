// ============================================================================
// Reflection Migration Utilities
// Converts SimplifiedReflection to StructuredReflection for analytics compatibility
// ============================================================================

import {
  SimplifiedReflection,
  isSimplifiedReflection,
} from '../types/simplifiedReflection';
import {
  StructuredReflection,
  EgoAuditResponse,
  GardenLogResponse,
  NutrimentAuditResponse,
  VicissitudesResponse,
  DisappointmentResponse,
} from '../types/index';

/**
 * Maps a SimplifiedReflection to StructuredReflection format
 * This allows analytics to work seamlessly with both types
 *
 * @param simplified - SimplifiedReflection to convert
 * @returns StructuredReflection compatible with analytics
 */
export function mapSimplifiedToAnalytics(
  simplified: SimplifiedReflection
): StructuredReflection {
  const { mindIntention, experienceResponse, reflectionIntegration } = simplified;

  // Map Ego Audit Section
  const egoAudit: EgoAuditResponse | undefined = mindIntention
    ? {
        lordsOfMaterialism: {
          ...mindIntention.lordsOfMaterialism,
          notes: mindIntention.patternsNoticed, // Merged field
        },
        spiritualAdvisor: mindIntention.patternsNoticed, // Same merged field
        areYouSure: mindIntention.patternsNoticed, // Same merged field
      }
    : undefined;

  // Map Garden Log Section
  const gardenLog: GardenLogResponse | undefined = mindIntention
    ? {
        wholesomeSeeds: mindIntention.wholesomeSeeds,
        unwholesomeSeeds: mindIntention.unwholesomeSeeds,
        changingThePeg: mindIntention.patternResponse, // Merged field
        helloHabitEnergy: mindIntention.patternResponse, // Same merged field
      }
    : undefined;

  // Map Nutriment Audit Section (partially)
  const nutrimentAudit: NutrimentAuditResponse | undefined = experienceResponse
    ? {
        edibleFood: {
          wasMindful: false, // Not tracked in simplified
          notes: '',
        },
        senseImpressions: {
          toxicMedia: [], // Could parse from mentalConsumption if needed
          impact: experienceResponse.mentalConsumption,
        },
        intention: {
          deepDesire: '', // Not tracked in simplified
          selfOrOthers: 'both', // Default value
        },
        collectiveEnergy: '', // Not tracked in simplified
      }
    : undefined;

  // Map Vicissitudes Section
  const vicissitudes: VicissitudesResponse | undefined = experienceResponse
    ? {
        worldlyConditions: {}, // Individual conditions not tracked in simplified
        secondArrow: experienceResponse.secondArrow,
      }
    : undefined;

  // Map Disappointment Section
  const disappointment: DisappointmentResponse | undefined = experienceResponse
    ? {
        practiceFeltTedious: false, // Merged into hardGroundReflection
        hardGroundMoments: experienceResponse.hardGroundReflection,
        softLandingAttempts: experienceResponse.hardGroundReflection, // Same merged field
      }
    : undefined;

  // Map Daily Prompts
  const dailyPrompts = {
    selfReliance: reflectionIntegration.essentialQuestions.lettingGo, // Merged
    nowness: reflectionIntegration.essentialQuestions.presence, // Merged
    nonAttachment: reflectionIntegration.essentialQuestions.lettingGo, // Same merged field
    clarity: reflectionIntegration.essentialQuestions.presence, // Same merged field
  };

  // Construct the StructuredReflection
  return {
    id: simplified.id,
    type: 'structured', // Analytics expects this type
    paramiId: simplified.paramiId,
    date: simplified.date,
    createdAt: simplified.createdAt,
    updatedAt: simplified.updatedAt,

    // Map completedSections
    completedSections: {
      egoAudit: simplified.completedSections.mindIntention,
      gardenLog: simplified.completedSections.mindIntention,
      nutrimentAudit: simplified.completedSections.experienceResponse,
      vicissitudes: simplified.completedSections.experienceResponse,
      disappointment: simplified.completedSections.experienceResponse,
    },

    // Section data
    egoAudit,
    gardenLog,
    nutrimentAudit,
    vicissitudes,
    disappointment,

    // Daily prompts and summary
    dailyPrompts,
    emotionalState: reflectionIntegration.emotionalState,
    resilienceLevel: reflectionIntegration.resilienceLevel,
    overallReflection: reflectionIntegration.overallReflection,
  };
}

/**
 * Type guard to check if reflection needs mapping
 * @param reflection - Any reflection entry
 * @returns True if it's a SimplifiedReflection that needs mapping
 */
export function needsMappingForAnalytics(reflection: any): reflection is SimplifiedReflection {
  return isSimplifiedReflection(reflection);
}

/**
 * Safely maps a reflection to analytics-compatible format
 * Handles both SimplifiedReflection and StructuredReflection
 *
 * @param reflection - Any reflection entry
 * @returns StructuredReflection for analytics
 */
export function toAnalyticsFormat(
  reflection: SimplifiedReflection | StructuredReflection
): StructuredReflection {
  if (needsMappingForAnalytics(reflection)) {
    return mapSimplifiedToAnalytics(reflection);
  }
  return reflection as StructuredReflection;
}

/**
 * Batch convert an array of mixed reflection types to analytics format
 * @param reflections - Array of SimplifiedReflection and/or StructuredReflection
 * @returns Array of StructuredReflection for analytics processing
 */
export function batchToAnalyticsFormat(
  reflections: (SimplifiedReflection | StructuredReflection)[]
): StructuredReflection[] {
  return reflections.map(toAnalyticsFormat);
}

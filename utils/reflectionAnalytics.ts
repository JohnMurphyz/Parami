import {
  StructuredReflection,
  EmotionalState,
  ResilienceLevel,
} from '../types';

/**
 * Emotional trend data point
 */
export interface EmotionalTrend {
  date: string;
  emotionalState: EmotionalState;
  resilienceLevel: ResilienceLevel;
}

/**
 * Garden progress tracking
 */
export interface GardenProgress {
  wholesomeSeedsCount: number;
  unwholesomeSeedsCount: number;
  ratio: number; // Wholesome / Total (0-1)
  totalDays: number;
  averageWholesomePerDay: number;
  averageUnwholesomePerDay: number;
}

/**
 * Ego pattern frequencies
 */
export interface EgoPatterns {
  lordOfForm: number; // Percentage (0-100)
  lordOfSpeech: number;
  lordOfMind: number;
  totalDays: number;
  mostCommonLord: 'form' | 'speech' | 'mind' | null;
}

/**
 * Second Arrow tracking
 */
export interface SecondArrowStats {
  frequency: number; // Percentage (0-100)
  occurrences: number;
  totalDays: number;
  trend: 'improving' | 'stable' | 'worsening';
}

/**
 * Complete analytics summary
 */
export interface AnalyticsSummary {
  totalReflections: number;
  dateRange: {
    earliest: string;
    latest: string;
  };
  emotionalTrends: EmotionalTrend[];
  mostCommonEmotion: EmotionalState | null;
  averageResilience: number; // 1-3 scale (stable=3, wavering=2, struggling=1)
  resilienceTrend: 'improving' | 'stable' | 'declining';
  gardenProgress: GardenProgress;
  egoPatterns: EgoPatterns;
  secondArrowStats: SecondArrowStats;
}

/**
 * Calculate comprehensive analytics from structured reflections
 */
export function calculateAnalytics(
  reflections: StructuredReflection[]
): AnalyticsSummary | null {
  if (reflections.length === 0) {
    return null;
  }

  // Sort by date (oldest first for trend analysis)
  const sorted = [...reflections].sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalReflections: reflections.length,
    dateRange: {
      earliest: sorted[0].date,
      latest: sorted[sorted.length - 1].date,
    },
    emotionalTrends: calculateEmotionalTrends(sorted),
    mostCommonEmotion: calculateMostCommonEmotion(reflections),
    averageResilience: calculateAverageResilience(reflections),
    resilienceTrend: calculateResilienceTrend(sorted),
    gardenProgress: calculateGardenProgress(reflections),
    egoPatterns: calculateEgoPatterns(reflections),
    secondArrowStats: calculateSecondArrowStats(sorted),
  };
}

/**
 * Extract emotional trends over time
 */
function calculateEmotionalTrends(
  sortedReflections: StructuredReflection[]
): EmotionalTrend[] {
  return sortedReflections.map((r) => ({
    date: r.date,
    emotionalState: r.emotionalState,
    resilienceLevel: r.resilienceLevel,
  }));
}

/**
 * Find most common emotional state
 */
function calculateMostCommonEmotion(
  reflections: StructuredReflection[]
): EmotionalState | null {
  if (reflections.length === 0) return null;

  const counts: Record<EmotionalState, number> = {
    peaceful: 0,
    grateful: 0,
    challenged: 0,
    restless: 0,
    discouraged: 0,
  };

  reflections.forEach((r) => {
    counts[r.emotionalState]++;
  });

  let maxCount = 0;
  let mostCommon: EmotionalState = 'peaceful';

  (Object.keys(counts) as EmotionalState[]).forEach((state) => {
    if (counts[state] > maxCount) {
      maxCount = counts[state];
      mostCommon = state;
    }
  });

  return mostCommon;
}

/**
 * Calculate average resilience (1-3 scale)
 */
function calculateAverageResilience(
  reflections: StructuredReflection[]
): number {
  if (reflections.length === 0) return 0;

  const resilienceValues: Record<ResilienceLevel, number> = {
    stable: 3,
    wavering: 2,
    struggling: 1,
  };

  const total = reflections.reduce(
    (sum, r) => sum + resilienceValues[r.resilienceLevel],
    0
  );

  return total / reflections.length;
}

/**
 * Determine resilience trend (comparing first half to second half)
 */
function calculateResilienceTrend(
  sortedReflections: StructuredReflection[]
): 'improving' | 'stable' | 'declining' {
  if (sortedReflections.length < 4) return 'stable';

  const midpoint = Math.floor(sortedReflections.length / 2);
  const firstHalf = sortedReflections.slice(0, midpoint);
  const secondHalf = sortedReflections.slice(midpoint);

  const firstAvg = calculateAverageResilience(firstHalf);
  const secondAvg = calculateAverageResilience(secondHalf);

  const diff = secondAvg - firstAvg;

  if (diff > 0.2) return 'improving';
  if (diff < -0.2) return 'declining';
  return 'stable';
}

/**
 * Calculate garden progress (wholesome vs unwholesome seeds)
 */
function calculateGardenProgress(
  reflections: StructuredReflection[]
): GardenProgress {
  let totalWholesome = 0;
  let totalUnwholesome = 0;

  reflections.forEach((r) => {
    if (r.gardenLog) {
      totalWholesome += r.gardenLog.wholesomeSeeds.length;
      totalUnwholesome += r.gardenLog.unwholesomeSeeds.length;
    }
  });

  const total = totalWholesome + totalUnwholesome;
  const ratio = total > 0 ? totalWholesome / total : 0;

  return {
    wholesomeSeedsCount: totalWholesome,
    unwholesomeSeedsCount: totalUnwholesome,
    ratio,
    totalDays: reflections.length,
    averageWholesomePerDay: totalWholesome / reflections.length,
    averageUnwholesomePerDay: totalUnwholesome / reflections.length,
  };
}

/**
 * Calculate ego pattern frequencies
 */
function calculateEgoPatterns(
  reflections: StructuredReflection[]
): EgoPatterns {
  let formCount = 0;
  let speechCount = 0;
  let mindCount = 0;

  reflections.forEach((r) => {
    if (r.egoAudit) {
      if (r.egoAudit.lordsOfMaterialism.lordOfForm) formCount++;
      if (r.egoAudit.lordsOfMaterialism.lordOfSpeech) speechCount++;
      if (r.egoAudit.lordsOfMaterialism.lordOfMind) mindCount++;
    }
  });

  const total = reflections.length;
  const lordOfForm = (formCount / total) * 100;
  const lordOfSpeech = (speechCount / total) * 100;
  const lordOfMind = (mindCount / total) * 100;

  let mostCommonLord: 'form' | 'speech' | 'mind' | null = null;
  const maxCount = Math.max(formCount, speechCount, mindCount);
  if (maxCount > 0) {
    if (formCount === maxCount) mostCommonLord = 'form';
    else if (speechCount === maxCount) mostCommonLord = 'speech';
    else mostCommonLord = 'mind';
  }

  return {
    lordOfForm,
    lordOfSpeech,
    lordOfMind,
    totalDays: total,
    mostCommonLord,
  };
}

/**
 * Calculate Second Arrow statistics and trend
 */
function calculateSecondArrowStats(
  sortedReflections: StructuredReflection[]
): SecondArrowStats {
  let occurrences = 0;

  sortedReflections.forEach((r) => {
    if (r.vicissitudes?.secondArrow.occurred) {
      occurrences++;
    }
  });

  const frequency = (occurrences / sortedReflections.length) * 100;

  // Calculate trend (comparing first half to second half)
  let trend: 'improving' | 'stable' | 'worsening' = 'stable';

  if (sortedReflections.length >= 6) {
    const midpoint = Math.floor(sortedReflections.length / 2);
    const firstHalf = sortedReflections.slice(0, midpoint);
    const secondHalf = sortedReflections.slice(midpoint);

    const firstFreq =
      (firstHalf.filter((r) => r.vicissitudes?.secondArrow.occurred).length /
        firstHalf.length) *
      100;
    const secondFreq =
      (secondHalf.filter((r) => r.vicissitudes?.secondArrow.occurred).length /
        secondHalf.length) *
      100;

    const diff = secondFreq - firstFreq;

    if (diff < -10) trend = 'improving'; // Fewer second arrows = improvement
    else if (diff > 10) trend = 'worsening';
  }

  return {
    frequency,
    occurrences,
    totalDays: sortedReflections.length,
    trend,
  };
}

/**
 * Get analytics for a specific date range
 */
export function getAnalyticsForDateRange(
  reflections: StructuredReflection[],
  startDate: string,
  endDate: string
): AnalyticsSummary | null {
  const filtered = reflections.filter(
    (r) => r.date >= startDate && r.date <= endDate
  );
  return calculateAnalytics(filtered);
}

/**
 * Get analytics for the last N days
 */
export function getAnalyticsForLastNDays(
  reflections: StructuredReflection[],
  days: number
): AnalyticsSummary | null {
  const today = new Date();
  const startDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
  const startDateStr = startDate.toISOString().split('T')[0];

  const filtered = reflections.filter((r) => r.date >= startDateStr);
  return calculateAnalytics(filtered);
}

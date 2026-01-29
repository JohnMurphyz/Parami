import { QuizResponse, ParamiScore } from '../types';

/**
 * Calculate normalized score for a single parami
 *
 * Formula: ((strengthRating + (6 - weaknessRating) - 2) / 8) * 100
 *
 * This gives a true 0-100 scale where:
 * - Minimum: strength=1, weakness=5 → score=0
 * - Maximum: strength=5, weakness=1 → score=100
 * - Midpoint: strength=3, weakness=3 → score=50
 *
 * Examples:
 * - Strength 5, Weakness 1 = ((5 + 5 - 2) / 8) * 100 = 100 (perfect score)
 * - Strength 3, Weakness 3 = ((3 + 3 - 2) / 8) * 100 = 50 (moderate)
 * - Strength 1, Weakness 5 = ((1 + 1 - 2) / 8) * 100 = 0 (needs development)
 */
export function calculateParamiScore(response: QuizResponse): ParamiScore {
  const { paramiId, strengthRating, weaknessRating } = response;

  // Inverse the weakness rating (5 becomes 1, 1 becomes 5)
  const invertedWeakness = 6 - weaknessRating;

  // Scale to 0-100: subtract minimum possible (2), divide by range (8), multiply by 100
  const normalizedScore = ((strengthRating + invertedWeakness - 2) / 8) * 100;

  return {
    paramiId,
    strengthRating,
    weaknessRating,
    normalizedScore: Math.round(normalizedScore),
  };
}

/**
 * Calculate scores for all responses
 */
export function calculateAllScores(responses: QuizResponse[]): ParamiScore[] {
  return responses.map(calculateParamiScore);
}

/**
 * Categorize score strength
 * - 70-100: strong (well-developed parami)
 * - 50-69: moderate (developing parami)
 * - 0-49: developing (needs attention)
 */
export function getScoreCategory(score: number): 'strong' | 'moderate' | 'developing' {
  if (score >= 70) return 'strong';
  if (score >= 50) return 'moderate';
  return 'developing';
}

/**
 * Get top 3 strongest paramis (highest scores)
 */
export function getStrongestParamis(scores: ParamiScore[]): ParamiScore[] {
  return [...scores]
    .sort((a, b) => b.normalizedScore - a.normalizedScore)
    .slice(0, 3);
}

/**
 * Get top 3 paramis to develop (lowest scores)
 */
export function getParamisToDevelop(scores: ParamiScore[]): ParamiScore[] {
  return [...scores]
    .sort((a, b) => a.normalizedScore - b.normalizedScore)
    .slice(0, 3);
}

/**
 * Get overall quiz score (average of all paramis)
 */
export function getOverallScore(scores: ParamiScore[]): number {
  const sum = scores.reduce((acc, score) => acc + score.normalizedScore, 0);
  return Math.round(sum / scores.length);
}

/**
 * Get distribution of scores by category
 */
export function getScoreDistribution(scores: ParamiScore[]): {
  strong: number;
  moderate: number;
  developing: number;
} {
  const distribution = {
    strong: 0,
    moderate: 0,
    developing: 0,
  };

  scores.forEach((score) => {
    const category = getScoreCategory(score.normalizedScore);
    distribution[category]++;
  });

  return distribution;
}

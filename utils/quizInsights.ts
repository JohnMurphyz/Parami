import { ParamiScore, Practice, Parami } from '../types';
import { getStrongestParamis, getParamisToDevelop } from './quizScoring';

export interface QuizInsight {
  category: 'strength' | 'developing';
  paramis: ParamiScore[];
  message: string;
  teachings: string[];
  recommendedPractices: Practice[];
}

/**
 * Generate personalized insights based on quiz results
 */
export function generateInsights(
  scores: ParamiScore[],
  allParamis: Parami[]
): QuizInsight[] {
  const strongest = getStrongestParamis(scores);
  const toDevelop = getParamisToDevelop(scores);

  return [
    {
      category: 'strength',
      paramis: strongest,
      message: generateStrengthMessage(strongest, allParamis),
      teachings: getStrengthTeachings(),
      recommendedPractices: [],
    },
    {
      category: 'developing',
      paramis: toDevelop,
      message: generateDevelopmentMessage(toDevelop, allParamis),
      teachings: getDevelopmentTeachings(),
      recommendedPractices: getRecommendedPractices(toDevelop, allParamis),
    },
  ];
}

/**
 * Generate message for strengths
 */
function generateStrengthMessage(
  scores: ParamiScore[],
  paramis: Parami[]
): string {
  const names = scores
    .map((s) => {
      const p = paramis.find((p) => p.id === s.paramiId);
      return p ? p.englishName : '';
    })
    .filter(Boolean);

  if (names.length === 0) return '';

  const listNames =
    names.length === 1
      ? names[0]
      : names.length === 2
      ? names.join(' and ')
      : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;

  return `Your practice of ${listNames} shines brightly. These qualities are natural refuges you can rely upon in challenging times. Continue to cultivate these strengths—they illuminate the path for yourself and others.`;
}

/**
 * Generate message for areas to develop
 */
function generateDevelopmentMessage(
  scores: ParamiScore[],
  paramis: Parami[]
): string {
  const names = scores
    .map((s) => {
      const p = paramis.find((p) => p.id === s.paramiId);
      return p ? p.englishName : '';
    })
    .filter(Boolean);

  if (names.length === 0) return '';

  const listNames =
    names.length === 1
      ? names[0]
      : names.length === 2
      ? names.join(' and ')
      : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;

  return `Like a garden tended with care, ${listNames} are seeds ready to blossom. These areas invite your gentle attention and practice. Remember: the path unfolds one step at a time, and every moment offers fresh opportunity for growth.`;
}

/**
 * Buddhist teachings about strengths
 */
function getStrengthTeachings(): string[] {
  return [
    '"What you think, you become. What you feel, you attract. What you imagine, you create." — Buddha',
    '"The mind is everything. What you think you become." — Buddha',
    '"Your work is to discover your work and then with all your heart to give yourself to it." — Buddha',
  ];
}

/**
 * Buddhist teachings about development
 */
function getDevelopmentTeachings(): string[] {
  return [
    '"Drop by drop is the water pot filled. Likewise, the wise one, gathering it little by little, fills oneself with good." — Dhammapada',
    '"No one saves us but ourselves. No one can and no one may. We ourselves must walk the path." — Buddha',
    '"There is no path to happiness: happiness is the path." — Buddha',
    '"The secret of health for both mind and body is not to mourn for the past, not to worry about the future, but to live in the present moment wisely and earnestly." — Buddha',
  ];
}

/**
 * Get recommended practices for paramis that need development
 */
function getRecommendedPractices(
  scores: ParamiScore[],
  allParamis: Parami[]
): Practice[] {
  const practices: Practice[] = [];

  // Get 2-3 practices from each parami to develop
  scores.forEach((score) => {
    const parami = allParamis.find((p) => p.id === score.paramiId);
    if (parami && parami.practices) {
      // Get up to 2 practices from this parami
      const paramiPractices = parami.practices.slice(0, 2);
      practices.push(...paramiPractices);
    }
  });

  // Return up to 6 total practices
  return practices.slice(0, 6);
}

/**
 * Get overall assessment message based on score distribution
 */
export function getOverallAssessment(scores: ParamiScore[]): string {
  const avgScore =
    scores.reduce((sum, s) => sum + s.normalizedScore, 0) / scores.length;

  if (avgScore >= 70) {
    return 'Your practice is flourishing across the ten paramis. This strong foundation supports both your own wellbeing and your ability to serve others.';
  } else if (avgScore >= 50) {
    return 'You walk the Middle Way with balance, cultivating strengths while remaining aware of areas for growth. Continue with patience and persistence.';
  } else {
    return 'Every journey begins with a single step. These results offer clarity about where to focus your practice. Approach this path with self-compassion and curiosity.';
  }
}

/**
 * Get personalized recommendation based on weakest parami
 */
export function getPersonalizedRecommendation(
  weakestParami: ParamiScore,
  parami: Parami
): string {
  const recommendations: Record<number, string> = {
    1: 'Begin with small acts of giving—share your time, attention, or resources without expecting anything in return. Notice how generosity creates spaciousness in your heart.',
    2: 'Reflect each evening on your actions: Were they harmful, helpful, or neutral? This simple practice builds awareness and strengthens your ethical compass.',
    3: 'Practice letting go of one small attachment this week. Notice the freedom that comes from releasing what no longer serves you.',
    4: 'When faced with a decision, pause and ask: "Is this skillful?" Wisdom grows through conscious reflection on the consequences of our choices.',
    5: 'Choose one meaningful commitment and honor it fully for 30 days. Consistent effort, even in small things, builds the muscle of sustained practice.',
    6: 'When impatience arises, take three conscious breaths. Patience is not passive—it\'s an active choice to remain present with discomfort.',
    7: 'For one day, commit to complete honesty in all your speech. Notice how truthfulness creates clarity in relationships and inner peace.',
    8: 'Set a simple intention each morning and check in with it throughout the day. Determination is renewed moment by moment, not once and forever.',
    9: 'Practice metta meditation for five minutes daily, starting with yourself. Loving-kindness must begin within before it can flow outward.',
    10: 'When triggered by events, ask: "Can I accept this moment as it is?" Equanimity is born from radical acceptance of what we cannot change.',
  };

  return (
    recommendations[weakestParami.paramiId] ||
    `Focus your attention on ${parami.englishName}. Small, consistent practices create lasting transformation.`
  );
}

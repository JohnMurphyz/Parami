import { Practice } from '../types';
import { getParamiById } from '../data/paramis';
import { getExpandedPractices } from '../data/expandedPractices';

/**
 * Content Service
 *
 * Manages the rotation of practices, quotes, and stories.
 * Provides the "next" practice when a user swipes one away.
 */

/**
 * Get the next available practice for a Parami
 *
 * @param paramiId - The ID of the current Parami (1-10)
 * @param dismissedPracticeIds - Array of practice IDs that have been dismissed
 * @returns The next available practice, or undefined if pool exhausted
 */
export function getNextPractice(
  paramiId: number,
  dismissedPracticeIds: string[]
): Practice | undefined {
  // Get the base Parami
  const parami = getParamiById(paramiId);
  if (!parami) return undefined;

  // Combine default practices + expanded practices
  const allPractices = [
    ...parami.practices,
    ...getExpandedPractices(paramiId),
  ];

  // Filter out dismissed practices
  const availablePractices = allPractices.filter(
    practice => !dismissedPracticeIds.includes(practice.id)
  );

  // Return the first available practice
  // In a future enhancement, this could be randomized or personalized
  return availablePractices[0];
}

/**
 * Get all available practices for a Parami (not dismissed)
 *
 * @param paramiId - The ID of the current Parami (1-10)
 * @param dismissedPracticeIds - Array of practice IDs that have been dismissed
 * @returns Array of available practices
 */
export function getAvailablePractices(
  paramiId: number,
  dismissedPracticeIds: string[]
): Practice[] {
  const parami = getParamiById(paramiId);
  if (!parami) return [];

  const allPractices = [
    ...parami.practices,
    ...getExpandedPractices(paramiId),
  ];

  return allPractices.filter(
    practice => !dismissedPracticeIds.includes(practice.id)
  );
}

/**
 * Check if there are more practices available
 *
 * @param paramiId - The ID of the current Parami (1-10)
 * @param dismissedPracticeIds - Array of practice IDs that have been dismissed
 * @returns True if more practices are available
 */
export function hasMorePractices(
  paramiId: number,
  dismissedPracticeIds: string[]
): boolean {
  return getAvailablePractices(paramiId, dismissedPracticeIds).length > 0;
}

/**
 * Get total practice count for a Parami
 *
 * @param paramiId - The ID of the current Parami (1-10)
 * @returns Total number of practices (base + expanded)
 */
export function getTotalPracticeCount(paramiId: number): number {
  const parami = getParamiById(paramiId);
  if (!parami) return 0;

  const expandedPractices = getExpandedPractices(paramiId);
  return parami.practices.length + expandedPractices.length;
}

/**
 * Get practice progress stats
 *
 * @param paramiId - The ID of the current Parami (1-10)
 * @param dismissedPracticeIds - Array of practice IDs that have been dismissed
 * @returns Object with explored and total counts
 */
export function getPracticeProgress(
  paramiId: number,
  dismissedPracticeIds: string[]
): { explored: number; total: number; remaining: number } {
  const total = getTotalPracticeCount(paramiId);
  const explored = dismissedPracticeIds.length;
  const remaining = total - explored;

  return { explored, total, remaining };
}

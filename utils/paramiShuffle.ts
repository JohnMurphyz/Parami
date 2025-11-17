/**
 * Parami Shuffle System
 *
 * Manages a shuffled queue of all 10 Paramis that cycles without repetition.
 * When the queue is exhausted, a new shuffled queue is created (excluding the
 * last Parami to avoid back-to-back repeats).
 */

import { getLocalDateString, toLocalDateString } from './dateUtils';

/**
 * Fisher-Yates shuffle algorithm
 * Creates a truly random shuffle of the array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Create a new shuffled queue of Parami IDs (1-10)
 * Optionally excludes a specific ID to avoid back-to-back repeats
 */
export function createParamiQueue(excludeId?: number): number[] {
  let ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Remove the excluded ID if provided
  if (excludeId !== undefined) {
    ids = ids.filter(id => id !== excludeId);
  }

  // Shuffle the remaining IDs
  const shuffled = shuffleArray(ids);

  // If we excluded an ID, add it to the end to ensure all 10 are eventually seen
  if (excludeId !== undefined) {
    shuffled.push(excludeId);
  }

  return shuffled;
}

/**
 * Initialize the queue if it doesn't exist
 * Returns the initial queue and position
 */
export function initializeQueue(): { queue: number[]; position: number } {
  return {
    queue: createParamiQueue(),
    position: 0,
  };
}

/**
 * Get the next Parami ID from the queue
 * If queue is exhausted, creates a new queue (excluding the last Parami)
 */
export function getNextParamiFromQueue(
  currentQueue: number[],
  currentPosition: number
): { paramiId: number; newQueue: number[]; newPosition: number } {
  // If we're at the end of the queue, create a new one
  if (currentPosition >= currentQueue.length) {
    const lastParamiId = currentQueue[currentQueue.length - 1];
    const newQueue = createParamiQueue(lastParamiId);
    return {
      paramiId: newQueue[0],
      newQueue,
      newPosition: 1,
    };
  }

  // Get current Parami and advance position
  return {
    paramiId: currentQueue[currentPosition],
    newQueue: currentQueue,
    newPosition: currentPosition + 1,
  };
}

/**
 * Check if we should refresh the queue for a new day
 */
export function shouldRefreshForNewDay(lastRefreshDate?: string): boolean {
  if (!lastRefreshDate) return true;

  const today = getLocalDateString();
  const lastDate = toLocalDateString(lastRefreshDate);

  return today !== lastDate;
}

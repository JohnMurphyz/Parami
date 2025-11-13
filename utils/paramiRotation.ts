/**
 * Universal Randomized Parami Rotation
 *
 * This uses a seeded random number generator to ensure all users see the same
 * Parami on the same date, but in a randomized (not sequential) order.
 *
 * The algorithm:
 * 1. Takes the current date
 * 2. Uses it as a seed for a deterministic random number generator
 * 3. Generates a consistent "random" Parami ID (1-10) for that date
 */

// Simple seeded random number generator (LCG algorithm)
function seededRandom(seed: number): number {
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);

  const next = (a * seed + c) % m;
  return next / m; // Returns 0 to 1
}

// Convert a date to a consistent seed
function dateToSeed(date: Date): number {
  // Use year, month, day to create a consistent seed
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate(); // 1-31

  // Combine into a single number
  return year * 10000 + month * 100 + day;
}

/**
 * Get today's Parami ID (1-10) based on universal randomized rotation
 * This will return the same Parami ID for all users on the same date
 */
export function getTodayParamiId(): number {
  const today = new Date();
  const seed = dateToSeed(today);
  const random = seededRandom(seed);

  // Convert random (0-1) to Parami ID (1-10)
  return Math.floor(random * 10) + 1;
}

/**
 * Get the Parami ID for a specific date
 * Useful for testing or showing future/past Paramis
 */
export function getParamiIdForDate(date: Date): number {
  const seed = dateToSeed(date);
  const random = seededRandom(seed);
  return Math.floor(random * 10) + 1;
}

/**
 * Get the next date when a specific Parami will appear
 * Searches up to 30 days in the future
 */
export function getNextDateForParami(paramiId: number): Date | null {
  const today = new Date();

  // Search next 30 days
  for (let i = 1; i <= 30; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);

    if (getParamiIdForDate(futureDate) === paramiId) {
      return futureDate;
    }
  }

  return null; // Not found in next 30 days
}

/**
 * Get how many days until a specific Parami appears again
 */
export function getDaysUntilParami(paramiId: number): number | null {
  const nextDate = getNextDateForParami(paramiId);
  if (!nextDate) return null;

  const today = new Date();
  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

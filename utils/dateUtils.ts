/**
 * Utility functions for date handling with proper timezone support
 */

/**
 * Get the current date in local timezone as YYYY-MM-DD string
 */
export function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert a Date object or ISO string to local YYYY-MM-DD string
 */
export function toLocalDateString(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if two dates are the same day in local timezone
 */
export function isSameLocalDay(date1: Date | string, date2: Date | string): boolean {
  return toLocalDateString(date1) === toLocalDateString(date2);
}

/**
 * Get current date/time as ISO string (for storage)
 */
export function getCurrentISOString(): string {
  return new Date().toISOString();
}

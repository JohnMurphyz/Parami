const isDevelopment = __DEV__;

/**
 * Conditional logger that only logs in development mode
 * In production, only errors are logged to console
 */
export const logger = {
  /**
   * Log informational messages (development only)
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log warnings (development only)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log errors (always logged to console)
   */
  error: (message: string, error?: unknown, context?: Record<string, any>) => {
    // Always log errors to console
    console.error(message, error, context);
  },

  /**
   * Log debug messages (development only)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Log info with context (development only)
   */
  info: (message: string, data?: Record<string, any>) => {
    if (isDevelopment) {
      console.info(message, data);
    }
  },
};

// Conditional Sentry import with error handling for React 19 compatibility
let Sentry: typeof import('@sentry/react-native') | null = null;

try {
  Sentry = require('@sentry/react-native');
} catch (error) {
  console.warn('Sentry failed to load (this is expected with React 19):', error);
}

const isDevelopment = __DEV__;

/**
 * Conditional logger that only logs in development mode
 * In production, only errors are logged and sent to Sentry (if available)
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
   * Log errors (always logged, sent to Sentry in production if available)
   */
  error: (message: string, error?: unknown, context?: Record<string, any>) => {
    // Always log errors to console
    console.error(message, error);

    // Send to Sentry in production if available
    if (!isDevelopment && error && Sentry) {
      if (error instanceof Error) {
        Sentry.captureException(error, {
          tags: { context: message },
          extra: context,
        });
      } else {
        Sentry.captureMessage(`${message}: ${JSON.stringify(error)}`, 'error');
      }
    }
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
   * Log info with context (development only, tracked in Sentry as breadcrumb in production if available)
   */
  info: (message: string, data?: Record<string, any>) => {
    if (isDevelopment) {
      console.info(message, data);
    } else if (Sentry) {
      // Add as breadcrumb in production for error context
      Sentry.addBreadcrumb({
        category: 'info',
        message,
        data,
        level: 'info',
      });
    }
  },
};

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
import { logger } from '../utils/logger';

/**
 * Firebase configuration loaded from environment variables
 */
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || 'AIzaSyC16Bbc8NqpgT03AuY14WKAuPrGUp5wkLU',
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || 'parami-app.firebaseapp.com',
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || 'parami-app',
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || 'parami-app.firebasestorage.app',
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || '929149012360',
  appId: Constants.expoConfig?.extra?.firebaseAppId || '1:929149012360:web:7155c3cf60693bd698523d',
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || 'G-1XN30JKHRN',
};

// Validate configuration
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value || value === 'undefined')
  .map(([key]) => key);

if (missingKeys.length > 0) {
  logger.error('Missing Firebase configuration keys:', missingKeys);
  throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
}

/**
 * Initialize Firebase app (singleton pattern)
 */
let app;
try {
  // Check if Firebase app is already initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    logger.info('Firebase initialized successfully');
  } else {
    app = getApp();
    logger.info('Using existing Firebase app instance');
  }
} catch (error) {
  logger.error('Firebase initialization failed', error);
  throw error;
}

/**
 * Initialize Firestore with React Native optimizations
 *
 * Settings:
 * - experimentalForceLongPolling: Better for React Native (avoids WebSocket issues)
 * - cacheSizeBytes: Unlimited cache for offline support
 */
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { app, db };

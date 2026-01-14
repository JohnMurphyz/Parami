import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
import { logger } from '../utils/logger';

/**
 * Firebase configuration loaded from environment variables
 */
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId,
};

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

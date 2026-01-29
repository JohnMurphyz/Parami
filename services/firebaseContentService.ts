/**
 * Firebase Content Service
 *
 * Offline-first content management with background sync
 *
 * Architecture:
 * 1. Always load from AsyncStorage cache first (instant, < 100ms)
 * 2. Display content immediately (100% offline capable)
 * 3. Background check Firestore for updates
 * 4. If new version detected → download → update cache
 * 5. Notify user of new content (optional)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Parami, Practice, ContentCache, ContentMetadata, STORAGE_KEYS } from '../types';
import { logger } from '../utils/logger';
import { PARAMIS } from '../data/paramis';
import { EXPANDED_PRACTICES } from '../data/expandedPractices';

/**
 * In-memory cache for instant access
 * Loaded from AsyncStorage on app startup
 */
let inMemoryCache: ContentCache | null = null;

/**
 * Background sync status
 */
let isSyncing = false;
let lastSyncAttempt: Date | null = null;

/**
 * Initialize content system
 *
 * Called on app launch:
 * 1. Load from AsyncStorage cache (instant)
 * 2. Populate in-memory cache
 * 3. Trigger background sync with Firestore
 */
export async function initializeContent(): Promise<void> {
  try {
    logger.info('Initializing content system...');

    // Step 1: Load from AsyncStorage cache
    const cachedContent = await loadFromCache();

    if (cachedContent) {
      inMemoryCache = cachedContent;
      logger.info(`Content loaded from cache (version ${cachedContent.version})`);

      // Notify notification service that content is ready
      await notifyNotificationServiceContentReady();
    } else {
      // No cache exists - use bundled static content as fallback
      logger.warn('No cache found, using bundled static content');
      await initializeWithStaticContent();
    }

    // Step 2: Background sync (non-blocking)
    // Don't await - let it run in background
    syncContentInBackground().catch(error => {
      logger.error('Background sync failed', error);
    });

    logger.info('Content initialization complete');
  } catch (error) {
    logger.error('Content initialization failed', error);
    // Fallback to static content
    await initializeWithStaticContent();
  }
}

/**
 * Initialize with bundled static content (fallback)
 */
async function initializeWithStaticContent(): Promise<void> {
  logger.info('Initializing with bundled static content...');

  const staticCache: ContentCache = {
    version: 0, // Version 0 indicates bundled content
    lastFetched: new Date().toISOString(),
    paramis: PARAMIS,
    expandedPractices: EXPANDED_PRACTICES,
  };

  inMemoryCache = staticCache;
  await saveToCache(staticCache);

  logger.info('Bundled static content loaded');

  // Notify notification service that content is ready
  await notifyNotificationServiceContentReady();
}

/**
 * Load content from AsyncStorage cache
 */
async function loadFromCache(): Promise<ContentCache | null> {
  try {
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.CONTENT_CACHE);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as ContentCache;
    return parsed;
  } catch (error) {
    logger.error('Failed to load from cache', error);
    return null;
  }
}

/**
 * Save content to AsyncStorage cache
 */
async function saveToCache(content: ContentCache): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CONTENT_CACHE, JSON.stringify(content));
    logger.info(`Content saved to cache (version ${content.version})`);
  } catch (error) {
    logger.error('Failed to save to cache', error);
  }
}

/**
 * Background sync with Firestore
 *
 * 1. Check current version in cache
 * 2. Fetch metadata from Firestore
 * 3. Compare versions
 * 4. If new version available, download all content
 * 5. Update cache and in-memory state
 */
async function syncContentInBackground(): Promise<void> {
  // Prevent concurrent syncs
  if (isSyncing) {
    logger.info('Sync already in progress, skipping');
    return;
  }

  // Rate limiting: Don't sync more than once every 5 minutes
  if (lastSyncAttempt && Date.now() - lastSyncAttempt.getTime() < 5 * 60 * 1000) {
    logger.info('Sync rate limited, skipping');
    return;
  }

  isSyncing = true;
  lastSyncAttempt = new Date();

  try {
    logger.info('Starting background content sync...');

    // Step 1: Get current cached version
    const currentVersion = inMemoryCache?.version || 0;
    logger.info(`Current cached version: ${currentVersion}`);

    // Step 2: Fetch metadata from Firestore
    const metadataDoc = await getDoc(doc(db, 'metadata', 'content'));

    if (!metadataDoc.exists()) {
      logger.warn('Metadata document not found in Firestore');
      return;
    }

    const metadata = metadataDoc.data() as ContentMetadata;
    const remoteVersion = metadata.version;
    logger.info(`Remote version: ${remoteVersion}`);

    // Step 3: Compare versions
    if (remoteVersion <= currentVersion) {
      logger.info('Content is up to date');
      return;
    }

    // Step 4: New version available - download content
    logger.info(`New version available (${remoteVersion}), downloading...`);
    const newContent = await downloadAllContent(metadata);

    // Step 5: Update cache and in-memory state
    inMemoryCache = newContent;
    await saveToCache(newContent);

    logger.info(`Content updated successfully to version ${remoteVersion}`);
  } catch (error) {
    logger.error('Background sync failed', error);
    // Don't throw - app continues with cached content
  } finally {
    isSyncing = false;
  }
}

/**
 * Download all content from Firestore
 */
async function downloadAllContent(metadata: ContentMetadata): Promise<ContentCache> {
  logger.info('Downloading all content from Firestore...');

  // Fetch all Paramis
  const paramisSnapshot = await getDocs(collection(db, 'paramis'));
  const paramis: Parami[] = [];

  paramisSnapshot.forEach(doc => {
    paramis.push(doc.data() as Parami);
  });

  // Sort by ID
  paramis.sort((a, b) => a.id - b.id);

  // Fetch all expanded practices
  const expandedPracticesSnapshot = await getDocs(collection(db, 'expandedPractices'));
  const expandedPractices: Record<number, Practice[]> = {};

  expandedPracticesSnapshot.forEach(doc => {
    const data = doc.data();
    expandedPractices[data.paramiId] = data.practices;
  });

  const cache: ContentCache = {
    version: metadata.version,
    lastFetched: new Date().toISOString(),
    paramis,
    expandedPractices,
    metadata,
  };

  logger.info(`Downloaded ${paramis.length} Paramis and ${Object.keys(expandedPractices).length} practice sets`);

  return cache;
}

/**
 * Force refresh content from Firestore
 * (for manual refresh button in settings)
 */
export async function forceRefreshContent(): Promise<boolean> {
  try {
    const currentVersion = inMemoryCache?.version || 0;
    logger.info(`Force refreshing content... (current version: ${currentVersion})`);

    // Fetch metadata
    const metadataDoc = await getDoc(doc(db, 'metadata', 'content'));
    if (!metadataDoc.exists()) {
      logger.error('Metadata document not found in Firestore');
      throw new Error('Metadata not found');
    }

    const metadata = metadataDoc.data() as ContentMetadata;
    logger.info(`Remote version: ${metadata.version}`);

    // Download all content (even if version is the same - this is a force refresh)
    const newContent = await downloadAllContent(metadata);

    // Update cache
    inMemoryCache = newContent;
    await saveToCache(newContent);

    logger.info(`Force refresh completed successfully (new version: ${metadata.version})`);
    return true;
  } catch (error) {
    logger.error('Force refresh failed', error);
    return false;
  }
}

/**
 * Clear all cached content and force re-download
 * (for debugging/development)
 */
export async function clearCacheAndRefresh(): Promise<boolean> {
  try {
    logger.info('Clearing cache and forcing refresh...');

    // Clear AsyncStorage cache
    await AsyncStorage.removeItem(STORAGE_KEYS.CONTENT_CACHE);

    // Clear in-memory cache
    inMemoryCache = null;

    // Force refresh
    const success = await forceRefreshContent();

    if (success) {
      logger.info('Cache cleared and content refreshed successfully');
    }

    return success;
  } catch (error) {
    logger.error('Clear cache and refresh failed', error);
    return false;
  }
}

/**
 * Get Parami by ID
 * Always reads from in-memory cache (offline-safe, instant)
 */
export function getParamiById(id: number): Parami | undefined {
  if (!inMemoryCache) {
    logger.warn('In-memory cache not initialized');
    return undefined;
  }

  return inMemoryCache.paramis.find(p => p.id === id);
}

/**
 * Get all Paramis
 * Always reads from in-memory cache (offline-safe, instant)
 */
export function getAllParamis(): Parami[] {
  if (!inMemoryCache) {
    logger.warn('In-memory cache not initialized');
    return [];
  }

  return inMemoryCache.paramis;
}

/**
 * Get expanded practices for a Parami
 * Always reads from in-memory cache (offline-safe, instant)
 */
export function getExpandedPractices(paramiId: number): Practice[] {
  if (!inMemoryCache) {
    logger.warn('In-memory cache not initialized');
    return [];
  }

  return inMemoryCache.expandedPractices[paramiId] || [];
}

/**
 * Get current content version
 */
export function getContentVersion(): number {
  return inMemoryCache?.version || 0;
}

/**
 * Get last fetch timestamp
 */
export function getLastFetchTime(): string | null {
  return inMemoryCache?.lastFetched || null;
}

/**
 * Check if content is ready
 */
export function isContentReady(): boolean {
  return inMemoryCache !== null;
}

/**
 * Notify notification service that content is ready
 * Uses dynamic import to avoid circular dependency
 */
async function notifyNotificationServiceContentReady(): Promise<void> {
  try {
    const { notifyContentReady } = await import('./notificationService');
    notifyContentReady();
    logger.info('Notification service notified of content readiness');
  } catch (error) {
    logger.error('Failed to notify notification service', error);
  }
}

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { loadPreferences } from '../services/storageService';
import { logger } from '../utils/logger';

export default function Index() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const preferences = await loadPreferences();
      setHasCompletedOnboarding(preferences.hasCompletedOnboarding ?? false);
    } catch (error) {
      logger.error('Error checking onboarding status', error);
      setHasCompletedOnboarding(false);
    }
  };

  // Show nothing while checking
  if (hasCompletedOnboarding === null) {
    return <View style={{ flex: 1, backgroundColor: '#F5F1E8' }} />;
  }

  // Redirect based on onboarding status
  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding" />;
}

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getParamiById } from '../../data/paramis';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import ParamiHeroCard from '../../components/ParamiHeroCard';
import PracticeCard from '../../components/PracticeCard';
import WizardModal from '../../components/WizardModal';
import {
  getTodayParamiId,
  shuffleToNextParami,
  shouldShowWizard,
  updateWizardCompletion,
  saveCustomPractice,
  getCustomPractice,
  loadPreferences,
} from '../../services/storageService';
import { updateNotificationContent } from '../../services/notificationService';

export default function HomeScreen() {
  const [todayParamiId, setTodayParamiId] = useState<number | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [customPracticeText, setCustomPracticeText] = useState<string | undefined>();
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    loadTodayParami();
  }, []);

  useEffect(() => {
    if (todayParamiId) {
      checkWizardStatus();
      loadCustomPractice();
    }
  }, [todayParamiId]);

  const loadTodayParami = async () => {
    const paramiId = await getTodayParamiId();
    setTodayParamiId(paramiId);

    // Update notification content with current Parami
    const preferences = await loadPreferences();
    if (preferences.notificationsEnabled) {
      await updateNotificationContent(preferences.notificationTime);
    }
  };

  const checkWizardStatus = async () => {
    const shouldShow = await shouldShowWizard(todayParamiId);
    setShowWizard(shouldShow);
  };

  const loadCustomPractice = async () => {
    const practice = await getCustomPractice(todayParamiId);
    setCustomPracticeText(practice);
  };

  const handleWizardComplete = async (customPractice?: string) => {
    if (customPractice) {
      await saveCustomPractice(todayParamiId, customPractice);
      setCustomPracticeText(customPractice);
    }
    await updateWizardCompletion(todayParamiId);
    setShowWizard(false);
  };

  const handleWizardSkip = async () => {
    await updateWizardCompletion(todayParamiId);
    setShowWizard(false);
  };

  const handleReviewParami = () => {
    setShowWizard(true);
  };

  const handleShuffle = async () => {
    if (isShuffling) return; // Prevent multiple rapid clicks

    setIsShuffling(true);
    try {
      const newParamiId = await shuffleToNextParami();
      setTodayParamiId(newParamiId);
      // Clear the custom practice text immediately, it will reload from the new Parami
      setCustomPracticeText(undefined);

      // Update notification content with new Parami
      const preferences = await loadPreferences();
      if (preferences.notificationsEnabled) {
        await updateNotificationContent(preferences.notificationTime);
      }

      setShowWizard(true);
    } finally {
      setIsShuffling(false);
    }
  };

  if (!todayParamiId) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const parami = getParamiById(todayParamiId);

  if (!parami) {
    return (
      <View style={styles.container}>
        <Text>Error loading today's Parami</Text>
      </View>
    );
  }

  return (
    <>
      {/* Wizard Modal */}
      <WizardModal
        visible={showWizard}
        parami={parami}
        onComplete={handleWizardComplete}
        onSkip={handleWizardSkip}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Minimal Header */}
        <View style={styles.header}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleShuffle} disabled={isShuffling}>
              <Ionicons name="shuffle" size={16} color={Colors.saffronGold} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.reviewButton} onPress={handleReviewParami}>
              <Text style={styles.reviewButtonText}>Review</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.spacer} />

        {/* Hero Card - Main Focal Point */}
        <ParamiHeroCard
          paramiId={parami.id}
          paramiName={parami.name}
          englishName={parami.englishName}
          shortDescription={parami.shortDescription}
          currentIndex={parami.id}
          totalCount={10}
        />

        {/* Content Below Hero Card */}
        <View style={styles.content}>
          {/* Full Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Understanding</Text>
            <Text style={styles.descriptionText}>{parami.fullDescription}</Text>
          </View>

          {/* Quote */}
          <View style={styles.quoteSection}>
            <Text style={styles.quoteText}>"{parami.quote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {parami.quote.author}</Text>
            {parami.quote.source && (
              <Text style={styles.quoteSource}>{parami.quote.source}</Text>
            )}
          </View>

          {/* Practice Suggestions */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Practice Today</Text>
            <Text style={styles.sectionSubtitle}>
              Choose one practice to cultivate this Parami:
            </Text>

            {/* Custom Practice (if exists) */}
            {customPracticeText && (
              <View style={styles.customPracticeCard}>
                <View style={styles.customPracticeHeader}>
                  <Text style={styles.customPracticeLabel}>Your Practice</Text>
                </View>
                <Text style={styles.customPracticeText}>{customPracticeText}</Text>
              </View>
            )}

            {/* Default Practices */}
            {parami.practices.map((practice, index) => (
              <View key={practice.id} style={styles.practiceCardWrapper}>
                <PracticeCard practice={practice} number={index + 1} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmStone,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spacer: {
    height: 24,
  },
  dateText: {
    ...Typography.body,
    color: Colors.mediumStone,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  section: {
    marginBottom: 40,
  },
  sectionLabel: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
    marginBottom: 16,
  },
  descriptionText: {
    ...Typography.bodyLarge,
    color: Colors.deepStone,
  },
  quoteSection: {
    backgroundColor: Colors.lotusPink12,
    padding: 24,
    borderRadius: 20,
    marginBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Colors.lotusPink40,
  },
  quoteText: {
    ...Typography.quote,
    color: Colors.deepCharcoal,
    marginBottom: 16,
  },
  quoteAuthor: {
    ...Typography.body,
    color: Colors.deepStone,
    fontWeight: '600',
  },
  quoteSource: {
    ...Typography.caption,
    color: Colors.mediumStone,
    marginTop: 4,
  },
  sectionSubtitle: {
    ...Typography.body,
    color: Colors.mediumStone,
    marginBottom: 24,
  },
  practiceCardWrapper: {
    marginBottom: 16,
  },
  customPracticeCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.lotusPink,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  customPracticeHeader: {
    marginBottom: 12,
  },
  customPracticeLabel: {
    ...Typography.h3,
    color: Colors.lotusPink,
  },
  customPracticeText: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 22,
  },
  iconButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.saffronGold08,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.saffronGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.saffronGold08,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.saffronGold,
  },
  reviewButtonText: {
    ...Typography.caption,
    color: Colors.saffronGold,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

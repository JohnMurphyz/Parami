import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, TextInput, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as StoreReview from 'expo-store-review';
import { Practice } from '../../types';
import { getParamiById } from '../../data/paramis';
import { getAvailablePractices, getNextPractice, hasMorePractices, getTotalPracticeCount } from '../../services/contentService';
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
  getCheckedPractices,
  togglePracticeChecked,
} from '../../services/storageService';
import { updateNotificationContent } from '../../services/notificationService';

export default function HomeScreen() {
  const [todayParamiId, setTodayParamiId] = useState<number | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [customPracticeText, setCustomPracticeText] = useState<string | undefined>();
  const [isShuffling, setIsShuffling] = useState(false);
  const [checkedPracticeIds, setCheckedPracticeIds] = useState<string[]>([]);
  const [dismissedPracticeIds, setDismissedPracticeIds] = useState<string[]>([]);
  const [visiblePractices, setVisiblePractices] = useState<Practice[]>([]);
  const [isEditingCustomPractice, setIsEditingCustomPractice] = useState(false);
  const [editedCustomPracticeText, setEditedCustomPracticeText] = useState<string>('');
  const [allPracticesExhausted, setAllPracticesExhausted] = useState(false);
  const [teachingsSectionIndex, setTeachingsSectionIndex] = useState(0);
  const initializedParamiId = useRef<number | null>(null);
  const cardOpacities = useRef<{[key: string]: Animated.Value}>({});

  useEffect(() => {
    loadTodayParami();
  }, []);

  useEffect(() => {
    if (todayParamiId) {
      checkWizardStatus();
      loadCustomPractice();
      loadCheckedPractices();

      // Only initialize visible practices once per Parami
      if (initializedParamiId.current !== todayParamiId) {
        initializedParamiId.current = todayParamiId;
        initializeVisiblePractices();
      }
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

  const loadCheckedPractices = useCallback(async () => {
    const checked = await getCheckedPractices(todayParamiId);
    setCheckedPracticeIds(checked);
  }, [todayParamiId]);

  const getCardOpacity = (practiceId: string) => {
    if (!cardOpacities.current[practiceId]) {
      cardOpacities.current[practiceId] = new Animated.Value(1);
    }
    return cardOpacities.current[practiceId];
  };

  const initializeVisiblePractices = () => {
    // Start with just the base 3 practices from the Parami
    const parami = getParamiById(todayParamiId);
    if (parami) {
      setVisiblePractices(parami.practices);
      setDismissedPracticeIds([]);
      setAllPracticesExhausted(false);
      // Initialize opacities for new practices
      parami.practices.forEach(p => getCardOpacity(p.id).setValue(1));
    }
  };

  const handleDismissPractice = useCallback((practiceId: string) => {
    const opacity = getCardOpacity(practiceId);

    // Fade out animation
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Clean up animated value after animation
      delete cardOpacities.current[practiceId];

      // After fade out, update state
      setDismissedPracticeIds(prevDismissed => [...prevDismissed, practiceId]);

      setVisiblePractices(prevVisible => {
        // Find the index of the card being replaced
        const indexToReplace = prevVisible.findIndex(p => p.id === practiceId);
        if (indexToReplace === -1) return prevVisible;

        // Calculate all shown IDs (including what we're dismissing and what's visible)
        const allShownIds = Array.from(new Set([
          ...prevVisible.map(p => p.id),
          ...dismissedPracticeIds,
          practiceId,
        ]));

        // Get next practice
        const nextPractice = getNextPractice(todayParamiId, allShownIds);

        if (nextPractice) {
          // Initialize new card opacity at 0 and fade in
          const newOpacity = getCardOpacity(nextPractice.id);
          newOpacity.setValue(0);
          Animated.timing(newOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();

          // Replace the card at the same index position
          const updated = [...prevVisible];
          updated[indexToReplace] = nextPractice;

          // Check if there are still more practices after this replacement
          const allShownAfterReplacement = [...allShownIds, nextPractice.id];
          const stillHasMore = hasMorePractices(todayParamiId, allShownAfterReplacement);
          setAllPracticesExhausted(!stillHasMore);

          return updated;
        } else {
          // No more practices available
          setAllPracticesExhausted(true);
        }

        return prevVisible;
      });
    });
  }, [todayParamiId, dismissedPracticeIds]);

  const handleTogglePractice = useCallback(async (practiceId: string) => {
    await togglePracticeChecked(todayParamiId, practiceId);
    // Reload checked practices to update UI
    await loadCheckedPractices();

    // Prompt for review after completing 3 practices
    const practices = await getCheckedPractices(todayParamiId);
    if (practices.length === 3) {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (isAvailable) {
        await StoreReview.requestReview();
      }
    }
  }, [todayParamiId, loadCheckedPractices]);

  const handleWizardComplete = useCallback(async (customPractice?: string) => {
    if (customPractice) {
      await saveCustomPractice(todayParamiId, customPractice);
      setCustomPracticeText(customPractice);
    }
    await updateWizardCompletion(todayParamiId);
    setShowWizard(false);
  }, [todayParamiId]);

  const handleWizardSkip = useCallback(async () => {
    await updateWizardCompletion(todayParamiId);
    setShowWizard(false);
  }, [todayParamiId]);

  const handleReviewParami = useCallback(() => {
    setShowWizard(true);
  }, []);

  const handleShuffle = useCallback(async () => {
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
  }, [isShuffling]);

  const handleEditCustomPractice = () => {
    setEditedCustomPracticeText(customPracticeText || '');
    setIsEditingCustomPractice(true);
  };

  const handleSaveCustomPractice = async () => {
    const MAX_PRACTICE_LENGTH = 500;
    const text = editedCustomPracticeText.trim();

    // Validation
    if (!text) {
      Alert.alert('Error', 'Practice cannot be empty');
      return;
    }

    if (text.length > MAX_PRACTICE_LENGTH) {
      Alert.alert(
        'Text Too Long',
        `Practice must be ${MAX_PRACTICE_LENGTH} characters or less. Current length: ${text.length}`
      );
      return;
    }

    // Sanitize - remove control characters but keep newlines and tabs
    const sanitized = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    await saveCustomPractice(todayParamiId, sanitized);
    setCustomPracticeText(sanitized);
    setIsEditingCustomPractice(false);
  };

  const handleResetPractices = () => {
    setDismissedPracticeIds([]);
    setAllPracticesExhausted(false);
    initializeVisiblePractices();
  };

  const handleTeachingsScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / Dimensions.get('window').width);
    setTeachingsSectionIndex(index);
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
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleShuffle}
              disabled={isShuffling}
              accessibilityLabel="Shuffle to next Parami"
              accessibilityHint="Advances to the next Parami in your practice rotation"
              accessibilityRole="button"
            >
              <Ionicons name="shuffle" size={16} color={Colors.saffronGold} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={handleReviewParami}
              accessibilityLabel="Review Parami teachings"
              accessibilityHint="Opens the welcome wizard to review this Parami's key concepts"
              accessibilityRole="button"
            >
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
          fullDescription={parami.fullDescription}
          currentIndex={parami.id}
          totalCount={10}
        />

        {/* Content Below Hero Card */}
        <View style={styles.content}>
          {/* Story Section */}
          <View style={styles.storySection}>
            <Text style={styles.sectionLabel}>Story</Text>
            <Text style={styles.storyText}>{parami.story}</Text>
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
              <TouchableOpacity
                style={[
                  styles.customPracticeCard,
                  checkedPracticeIds.includes('custom') && styles.customPracticeCardChecked
                ]}
                onPress={() => !isEditingCustomPractice && handleTogglePractice('custom')}
                activeOpacity={isEditingCustomPractice ? 1 : 0.7}
                disabled={isEditingCustomPractice}
                accessibilityLabel={checkedPracticeIds.includes('custom') ? "Custom practice completed" : "Your custom practice"}
                accessibilityHint="Double tap to mark this practice as completed for today"
                accessibilityRole="button"
              >
                <View style={styles.customPracticeHeader}>
                  {checkedPracticeIds.includes('custom') ? (
                    <Ionicons name="checkmark-circle" size={32} color={Colors.lotusPink} />
                  ) : (
                    <Text style={styles.customPracticeLabel}>Your Practice</Text>
                  )}
                  {!checkedPracticeIds.includes('custom') && !isEditingCustomPractice && (
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleEditCustomPractice();
                      }}
                      activeOpacity={0.6}
                      accessibilityLabel="Edit custom practice"
                      accessibilityHint="Opens text editor to modify your custom practice"
                      accessibilityRole="button"
                    >
                      <Ionicons name="pencil" size={18} color={Colors.lotusPink} />
                    </TouchableOpacity>
                  )}
                </View>
                {isEditingCustomPractice ? (
                  <TextInput
                    style={styles.customPracticeInput}
                    value={editedCustomPracticeText}
                    onChangeText={setEditedCustomPracticeText}
                    onBlur={handleSaveCustomPractice}
                    multiline
                    autoFocus
                    maxLength={500}
                    placeholder="Enter your custom practice..."
                    placeholderTextColor={Colors.mediumStone}
                  />
                ) : (
                  <Text style={styles.customPracticeText}>{customPracticeText}</Text>
                )}
              </TouchableOpacity>
            )}

            {/* Default Practices */}
            {visiblePractices.map((practice, index) => {
              // Check if there are more practices available for this specific card
              const allShownIds = Array.from(new Set([
                ...visiblePractices.map(p => p.id),
                ...dismissedPracticeIds,
              ]));
              const canStillShuffle = hasMorePractices(todayParamiId, allShownIds);

              return (
                <Animated.View
                  key={practice.id}
                  style={[
                    styles.practiceCardWrapper,
                    { opacity: getCardOpacity(practice.id) }
                  ]}
                >
                  <PracticeCard
                    practice={practice}
                    number={index + 1}
                    isChecked={checkedPracticeIds.includes(practice.id)}
                    onToggle={() => handleTogglePractice(practice.id)}
                    onShuffle={() => handleDismissPractice(practice.id)}
                    canShuffle={canStillShuffle}
                  />
                </Animated.View>
              );
            })}

            {/* All Practices Exhausted Message */}
            {allPracticesExhausted && (
              <View style={styles.exhaustedCard}>
                <Ionicons name="sparkles" size={32} color={Colors.saffronGold} />
                <Text style={styles.exhaustedTitle}>
                  You've explored all {getTotalPracticeCount(todayParamiId)} practices!
                </Text>
                <Text style={styles.exhaustedSubtitle}>
                  Amazing dedication to cultivating {parami.englishName}. Come back tomorrow for a new Parami, or reset to explore these practices again.
                </Text>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetPractices}
                  activeOpacity={0.7}
                  accessibilityLabel="Start fresh with practices"
                  accessibilityHint="Resets all practice cards to explore them again"
                  accessibilityRole="button"
                >
                  <Ionicons name="refresh" size={20} color={Colors.pureWhite} />
                  <Text style={styles.resetButtonText}>Start Fresh</Text>
                </TouchableOpacity>
              </View>
            )}
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
  storySection: {
    marginBottom: 40,
  },
  sectionLabel: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
    marginBottom: 16,
  },
  storyText: {
    ...Typography.bodyLarge,
    color: Colors.deepStone,
    lineHeight: 26,
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
  customPracticeCardChecked: {
    backgroundColor: Colors.saffronGold08,
    opacity: 0.85,
  },
  customPracticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lotusPink12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customPracticeInput: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 22,
    padding: 0,
    minHeight: 66,
  },
  exhaustedCard: {
    backgroundColor: Colors.saffronGold08,
    borderRadius: 20,
    padding: 24,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.saffronGold40,
  },
  exhaustedTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  exhaustedSubtitle: {
    ...Typography.body,
    color: Colors.deepStone,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.saffronGold,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  resetButtonText: {
    ...Typography.body,
    color: Colors.pureWhite,
    fontWeight: '700',
  },
});

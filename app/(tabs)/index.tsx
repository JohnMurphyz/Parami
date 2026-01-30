import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as StoreReview from 'expo-store-review';
import { Practice } from '../../types';
import { getParamiById, getExpandedPractices } from '../../services/firebaseContentService';
import { getAvailablePractices, getNextPractice, hasMorePractices, getTotalPracticeCount } from '../../services/contentService';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import ParamiHeroCard from '../../components/parami/ParamiHeroCard';
import PracticeCard from '../../components/practice/PracticeCard';
import WizardModal from '../../components/practice/WizardModal';
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
  updateHistoryEntry,
  isFavorited,
  addToFavorites,
  removeFromFavorites,
  getFavorite,
} from '../../services/storageService';
import { updateNotificationContent } from '../../services/notificationService';

export default function HomeScreen() {
  const [todayParamiId, setTodayParamiId] = useState<number | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [customPracticeText, setCustomPracticeText] = useState<string | undefined>();
  const [isShuffling, setIsShuffling] = useState(false);
  const [checkedPracticeIds, setCheckedPracticeIds] = useState<string[]>([]);
  const [dismissedPracticeIds, setDismissedPracticeIds] = useState<string[]>([]);
  const [practicesCompletedPreviously, setPracticesCompletedPreviously] = useState<string[]>([]);
  const [visiblePractices, setVisiblePractices] = useState<Practice[]>([]);
  const [isEditingCustomPractice, setIsEditingCustomPractice] = useState(false);
  const [editedCustomPracticeText, setEditedCustomPracticeText] = useState<string>('');
  const [allPracticesExhausted, setAllPracticesExhausted] = useState(false);
  const [quoteIsFavorited, setQuoteIsFavorited] = useState(false);
  const [favoritedPractices, setFavoritedPractices] = useState<Set<string>>(new Set());
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
      checkQuoteFavoriteStatus();
      loadPracticeFavorites();

      // Only initialize visible practices once per Parami
      if (initializedParamiId.current !== todayParamiId) {
        initializedParamiId.current = todayParamiId;
        initializeVisiblePractices();
      }
    }
  }, [todayParamiId]);

  // Reload favorites when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (todayParamiId) {
        checkQuoteFavoriteStatus();
        loadPracticeFavorites();
      }
    }, [todayParamiId])
  );

  const loadTodayParami = async () => {
    const paramiId = await getTodayParamiId();
    setTodayParamiId(paramiId);

    // Update history entry to track visit and streak
    await updateHistoryEntry(paramiId);

    // Update notification content with current Parami
    const preferences = await loadPreferences();
    if (preferences.notificationsEnabled) {
      await updateNotificationContent(preferences.notificationTime);
    }
  };

  const checkWizardStatus = async () => {
    if (todayParamiId === null) return;
    const shouldShow = await shouldShowWizard(todayParamiId);
    setShowWizard(shouldShow);
  };

  const loadCustomPractice = async () => {
    if (todayParamiId === null) return;
    const practice = await getCustomPractice(todayParamiId);
    setCustomPracticeText(practice);
  };

  const checkQuoteFavoriteStatus = async () => {
    if (todayParamiId === null) return;
    const parami = getParamiById(todayParamiId);
    if (parami) {
      const favorited = await isFavorited('quote', parami.quote.id);
      setQuoteIsFavorited(favorited);
    }
  };

  const loadPracticeFavorites = async () => {
    if (todayParamiId === null) return;
    const parami = getParamiById(todayParamiId);
    if (!parami) return;

    const favorited = new Set<string>();
    for (const practice of parami.practices) {
      const isFav = await isFavorited('practice', practice.id);
      if (isFav) {
        favorited.add(practice.id);
      }
    }
    // Also check visible practices
    for (const practice of visiblePractices) {
      const isFav = await isFavorited('practice', practice.id);
      if (isFav) {
        favorited.add(practice.id);
      }
    }
    setFavoritedPractices(favorited);
  };

  const loadCheckedPractices = useCallback(async () => {
    if (todayParamiId === null) return;
    const checked = await getCheckedPractices(todayParamiId);
    setCheckedPracticeIds(checked);
  }, [todayParamiId]);

  const getCardOpacity = (practiceId: string) => {
    if (!cardOpacities.current[practiceId]) {
      cardOpacities.current[practiceId] = new Animated.Value(1);
    }
    return cardOpacities.current[practiceId];
  };

  const initializeVisiblePractices = async () => {
    if (todayParamiId === null) return;

    const parami = getParamiById(todayParamiId);
    if (!parami) return;

    // Get ALL historically checked practices for this parami
    const allCheckedEver = await getCheckedPractices(todayParamiId);

    // Get currently checked practices for TODAY
    const checkedToday = checkedPracticeIds;

    // Previously completed = checked before but not today
    const completedPreviously = allCheckedEver.filter(id => !checkedToday.includes(id));
    setPracticesCompletedPreviously(completedPreviously);

    // Combine base and expanded practices, filter out previously completed
    const allAvailablePractices = [
      ...parami.practices,
      ...getExpandedPractices(todayParamiId)
    ].filter(p => !completedPreviously.includes(p.id));

    // Start with up to 3 available practices
    const initialPractices = allAvailablePractices.slice(0, 3);

    setVisiblePractices(initialPractices);
    setDismissedPracticeIds([]);

    // Check if there are more practices after showing initial 3
    const hasMore = hasMorePractices(todayParamiId, [
      ...initialPractices.map(p => p.id),
      ...completedPreviously
    ]);
    setAllPracticesExhausted(!hasMore);

    // Initialize opacities
    initialPractices.forEach(p => getCardOpacity(p.id).setValue(1));
  };

  const handleDismissPractice = useCallback((practiceId: string) => {
    if (todayParamiId === null) return;

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
        if (todayParamiId === null) return prevVisible;

        // Find the index of the card being replaced
        const indexToReplace = prevVisible.findIndex(p => p.id === practiceId);
        if (indexToReplace === -1) return prevVisible;

        // Calculate all shown IDs (including what we're dismissing, what's visible, and previously completed)
        const allShownIds = Array.from(new Set([
          ...prevVisible.map(p => p.id),
          ...dismissedPracticeIds,
          ...practicesCompletedPreviously,
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
  }, [todayParamiId, dismissedPracticeIds, practicesCompletedPreviously]);

  const handleAddPractice = useCallback(() => {
    if (todayParamiId === null) return;

    setVisiblePractices(prevVisible => {
      // Calculate all shown IDs
      const allShownIds = Array.from(new Set([
        ...prevVisible.map(p => p.id),
        ...dismissedPracticeIds,
        ...practicesCompletedPreviously,
      ]));

      // Get next practice
      const nextPractice = getNextPractice(todayParamiId, allShownIds);

      if (nextPractice) {
        // Initialize new card opacity and fade in
        const newOpacity = getCardOpacity(nextPractice.id);
        newOpacity.setValue(0);
        Animated.timing(newOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();

        // Add to end of array
        const updated = [...prevVisible, nextPractice];

        // Check if there are still more practices
        const allShownAfterAdd = [...allShownIds, nextPractice.id];
        const stillHasMore = hasMorePractices(todayParamiId, allShownAfterAdd);
        setAllPracticesExhausted(!stillHasMore);

        return updated;
      } else {
        // No more practices
        setAllPracticesExhausted(true);
      }

      return prevVisible;
    });
  }, [todayParamiId, dismissedPracticeIds, practicesCompletedPreviously]);

  const handleTogglePractice = useCallback(async (practiceId: string) => {
    if (todayParamiId === null) return;

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
    if (todayParamiId === null) return;

    if (customPractice) {
      await saveCustomPractice(todayParamiId, customPractice);
      setCustomPracticeText(customPractice);
    }
    await updateWizardCompletion(todayParamiId);
    setShowWizard(false);
  }, [todayParamiId]);

  const handleWizardSkip = useCallback(async () => {
    if (todayParamiId === null) return;

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
    if (todayParamiId === null) return;

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
    setPracticesCompletedPreviously([]);
    setAllPracticesExhausted(false);
    initializeVisiblePractices();
  };

  const handleToggleQuoteFavorite = async () => {
    if (todayParamiId === null) return;
    const parami = getParamiById(todayParamiId);
    if (!parami) return;

    try {
      if (quoteIsFavorited) {
        const favorite = await getFavorite('quote', parami.quote.id);
        if (favorite) {
          await removeFromFavorites(favorite.id);
          setQuoteIsFavorited(false);
        }
      } else {
        await addToFavorites('quote', todayParamiId, parami.quote.id);
        setQuoteIsFavorited(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    }
  };

  const handleTogglePracticeFavorite = async (practiceId: string) => {
    if (todayParamiId === null) return;

    try {
      const isFav = favoritedPractices.has(practiceId);
      if (isFav) {
        const favorite = await getFavorite('practice', practiceId);
        if (favorite) {
          await removeFromFavorites(favorite.id);
          setFavoritedPractices(prev => {
            const newSet = new Set(prev);
            newSet.delete(practiceId);
            return newSet;
          });
        }
      } else {
        await addToFavorites('practice', todayParamiId, practiceId);
        setFavoritedPractices(prev => new Set(prev).add(practiceId));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
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
            <TouchableOpacity
              style={styles.quoteFavoriteButton}
              onPress={handleToggleQuoteFavorite}
              activeOpacity={0.6}
              accessibilityLabel={quoteIsFavorited ? "Remove quote from favorites" : "Add quote to favorites"}
              accessibilityRole="button"
            >
              <Ionicons
                name={quoteIsFavorited ? "heart" : "heart-outline"}
                size={24}
                color={quoteIsFavorited ? Colors.lotusPink : Colors.mediumStone}
              />
            </TouchableOpacity>
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
                ...practicesCompletedPreviously,
              ]));
              const canStillShuffle = hasMorePractices(todayParamiId!, allShownIds);

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
                    isFavorited={favoritedPractices.has(practice.id)}
                    onFavorite={() => handleTogglePracticeFavorite(practice.id)}
                  />
                </Animated.View>
              );
            })}

            {/* Add Practice Button */}
            {!allPracticesExhausted && (
              <TouchableOpacity
                style={styles.addPracticeButton}
                onPress={handleAddPractice}
                activeOpacity={0.7}
                accessibilityLabel="Show another practice"
                accessibilityRole="button"
              >
                <Ionicons name="add-circle-outline" size={24} color={Colors.saffronGold} />
                <Text style={styles.addPracticeText}>Show Another Practice</Text>
              </TouchableOpacity>
            )}

            {/* All Practices Exhausted Message */}
            {allPracticesExhausted && (
              <View style={styles.exhaustedCard}>
                <Ionicons name="sparkles" size={32} color={Colors.saffronGold} />
                <Text style={styles.exhaustedTitle}>
                  You've explored all {getTotalPracticeCount(todayParamiId!)} ways to practice
                </Text>
                <Text style={styles.exhaustedSubtitle}>
                  Each practice is a doorway to {parami.englishName}. Return tomorrow for a new Parami, or revisit these with fresh perspective.
                </Text>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetPractices}
                  activeOpacity={0.7}
                  accessibilityLabel="Revisit practices"
                  accessibilityHint="Resets all practice cards to explore them again"
                  accessibilityRole="button"
                >
                  <Ionicons name="refresh" size={20} color={Colors.pureWhite} />
                  <Text style={styles.resetButtonText}>Revisit Practices</Text>
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
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderRadius: 18,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: Colors.lotusPink40,
    position: 'relative',
    transform: [{ rotate: '-0.2deg' }],
  },
  quoteFavoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.pureWhite,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  quoteText: {
    ...Typography.quote,
    color: Colors.deepCharcoal,
    marginBottom: 16,
    paddingRight: 48,
  },
  quoteAuthor: {
    ...Typography.body,
    color: Colors.deepStone,
    fontWeight: '600',
    paddingRight: 48,
  },
  quoteSource: {
    ...Typography.caption,
    color: Colors.mediumStone,
    marginTop: 4,
    paddingRight: 48,
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
    paddingVertical: 9,
    paddingHorizontal: 17,
    backgroundColor: Colors.saffronGold08,
    borderRadius: 16,
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
  addPracticeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.saffronGold08,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.saffronGold40,
    borderStyle: 'dashed',
  },
  addPracticeText: {
    ...Typography.body,
    color: Colors.saffronGold,
    fontWeight: '600',
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
    paddingVertical: 11,
    paddingHorizontal: 23,
    borderRadius: 20,
  },
  resetButtonText: {
    ...Typography.body,
    color: Colors.pureWhite,
    fontWeight: '700',
  },
});

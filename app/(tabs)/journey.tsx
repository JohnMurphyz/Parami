import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import {
  loadHistory,
  loadJournalEntries,
  loadPreferences,
  loadFavorites,
  getTodayParamiId,
  getJournalEntry,
  saveJournalEntry,
} from '../../services/storageService';
import { getParamiById } from '../../services/firebaseContentService';
import { getAvailablePractices } from '../../services/contentService';
import { HistoryEntry, JournalEntry, Favorite, Practice } from '../../types';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import DailyReflectionCard from '../../components/DailyReflectionCard';
import ExpandableHistoryCard from '../../components/ExpandableHistoryCard';

export default function JourneyScreen() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [practiceData, setPracticeData] = useState<Map<string, Practice>>(new Map());
  const [todayParamiId, setTodayParamiId] = useState<number | null>(null);
  const [todayJournalText, setTodayJournalText] = useState<string>('');
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [dailyReflectionCollapsed, setDailyReflectionCollapsed] = useState(false);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [lastQuizDate, setLastQuizDate] = useState<string | null>(null);

  useEffect(() => {
    loadJourneyData();
  }, []);

  // Reload journey data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadJourneyData();
    }, [])
  );

  const loadJourneyData = async () => {
    try {
      setLoading(true);

      // Load all data in parallel
      const [historyData, journals, favs, currentParamiId] = await Promise.all([
        loadHistory(),
        loadJournalEntries(),
        loadFavorites(),
        getTodayParamiId(),
      ]);

      console.log('Journey data loaded:', {
        historyCount: historyData.length,
        journalsCount: journals.length,
        favoritesCount: favs.length,
        paramiId: currentParamiId,
      });

      // Ensure we have a valid Parami ID (fallback to 1 if null)
      const validParamiId = currentParamiId || 1;

      // Load today's journal
      const todayJournal = await getJournalEntry(validParamiId);
      setTodayJournalText(todayJournal?.content || '');
      setDailyReflectionCollapsed(true); // Always start collapsed like a todo item

      // Load practice data for favorites
      const practiceMap = new Map<string, Practice>();
      try {
        for (const fav of favs) {
          if (fav.type === 'practice') {
            const allPractices = getAvailablePractices(fav.paramiId, []);
            const practice = allPractices.find((p) => p.id === fav.itemId);
            if (practice) {
              practiceMap.set(fav.itemId, practice);
            }
          }
        }
      } catch (favError) {
        console.error('Error loading practice data for favorites:', favError);
      }

      // Set state with safety checks
      setTodayParamiId(validParamiId);

      // Sort history safely
      const sortedHistory = [...historyData].sort((a, b) => {
        const dateA = String(b.date || '');
        const dateB = String(a.date || '');
        return dateA.localeCompare(dateB);
      });
      setHistory(sortedHistory);

      setJournalEntries(journals);

      // Sort favorites safely
      const sortedFavs = [...favs].sort((a, b) => {
        const dateA = String(b.addedAt || '');
        const dateB = String(a.addedAt || '');
        return dateA.localeCompare(dateB);
      });
      setFavorites(sortedFavs);

      setPracticeData(practiceMap);

      // Load quiz preferences
      const prefs = await loadPreferences();
      setHasCompletedQuiz(prefs.hasCompletedDiagnosticQuiz || false);
      setLastQuizDate(prefs.lastQuizDate || null);

      console.log('Journey state updated:', {
        history: historyData.length,
        favorites: favs.length,
      });
    } catch (error) {
      console.error('Error loading journey data:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      // Set default Parami ID even on error
      setTodayParamiId(1);
      // Set empty data to prevent crashes
      setHistory([]);
      setJournalEntries([]);
      setFavorites([]);
      setPracticeData(new Map());
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJournal = async (): Promise<boolean> => {
    if (!todayJournalText.trim() || !todayParamiId) return false;

    const MAX_JOURNAL_LENGTH = 2000;
    if (todayJournalText.length > MAX_JOURNAL_LENGTH) {
      Alert.alert('Text Too Long', `Max ${MAX_JOURNAL_LENGTH} characters`);
      return false;
    }

    try {
      await saveJournalEntry(todayParamiId, todayJournalText);
      await loadJourneyData(); // Reload to update history
      return true; // Success
    } catch (error) {
      Alert.alert('Error', 'Failed to save journal entry');
      return false; // Failure
    }
  };

  const handleToggleExpand = (date: string) => {
    setExpandedDates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.saffronGold} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Daily Reflection */}
        <DailyReflectionCard
          paramiId={todayParamiId || 1}
          journalText={todayJournalText}
          onJournalChange={setTodayJournalText}
          onSave={handleSaveJournal}
          isCollapsed={dailyReflectionCollapsed}
          onToggleCollapse={() => setDailyReflectionCollapsed(!dailyReflectionCollapsed)}
        />

        {/* Statistics - Simplified Layout */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>

          <View style={styles.statsRow}>
            {/* Entries Card - Navigable */}
            <TouchableOpacity
              style={[styles.statCard, {
                borderRadius: 18,
                transform: [{ rotate: '0.3deg' }],
                borderTopWidth: 2,
                borderTopColor: Colors.lotusPink40,
              }]}
              onPress={() => router.push('/entries')}
              activeOpacity={0.7}
            >
              <Ionicons name="book" size={24} color={Colors.lotusPink} />
              <Text style={styles.statNumber}>{journalEntries.length}</Text>
              <Text style={styles.statLabel}>Entries</Text>
            </TouchableOpacity>

            {/* Saved Treasures Card - Navigable */}
            <TouchableOpacity
              style={[styles.statCard, {
                borderRadius: 20,
                transform: [{ rotate: '0.2deg' }],
                borderTopWidth: 2,
                borderTopColor: Colors.lotusPink40,
              }]}
              onPress={() => router.push('/favorites')}
              activeOpacity={0.7}
            >
              <Ionicons name="heart" size={24} color={Colors.lotusPink} />
              <Text style={styles.statNumber}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* The Crossing Over Diagnostic Section */}
        <View style={styles.quizSection}>
          <Text style={styles.sectionTitle}>Discover Your Path</Text>

          <TouchableOpacity
            style={styles.quizCard}
            onPress={() => router.push(hasCompletedQuiz ? '/quiz-history' : '/quiz')}
            activeOpacity={0.7}
            accessibilityLabel={hasCompletedQuiz ? 'View The Crossing Over Diagnostic results' : 'Take The Crossing Over Diagnostic'}
            accessibilityRole="button"
          >
            <View style={styles.quizIconContainer}>
              <Ionicons name="compass-outline" size={32} color={Colors.saffronGold} />
            </View>
            <View style={styles.quizContent}>
              <Text style={styles.quizTitle}>The Crossing Over Diagnostic</Text>
              <Text style={styles.quizDescription}>
                {hasCompletedQuiz
                  ? 'See your past results and track your growth over time'
                  : 'Discover which paramis are your strengths and which need attention'}
              </Text>
              {lastQuizDate && (
                <Text style={styles.lastQuizDate}>
                  Last taken: {formatDate(lastQuizDate)}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.mediumStone} />
          </TouchableOpacity>
        </View>

        {/* History - Expandable Cards */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Your Journey</Text>

          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIllustration}>
                <Ionicons name="leaf-outline" size={32} color={Colors.deepMoss} style={{ marginBottom: 8 }} />
                <Ionicons name="water-outline" size={28} color={Colors.saffronGold} style={{ opacity: 0.6 }} />
              </View>
              <Text style={styles.emptyStateTitle}>A journey of ten thousand miles...</Text>
              <Text style={styles.emptyStateText}>
                Your first practice will appear here. Check off a practice today to mark the beginning.
              </Text>
            </View>
          ) : (
            history.map((entry, index) => {
              const parami = getParamiById(entry.paramiId);
              if (!parami) return null;

              const journalForDay = journalEntries.find(
                (j) => j.date === entry.date && j.paramiId === entry.paramiId
              );

              return (
                <ExpandableHistoryCard
                  key={entry.date}
                  entry={entry}
                  journalEntry={journalForDay}
                  parami={parami}
                  isExpanded={expandedDates.has(entry.date)}
                  onToggleExpand={() => handleToggleExpand(entry.date)}
                  index={index}
                />
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmStone,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  favoritesSection: {
    marginBottom: 32,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...Typography.h1,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.pureWhite,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    // borderRadius, borderTopWidth, borderTopColor, and transform are applied dynamically
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.deepCharcoal,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.mediumStone,
    textAlign: 'center',
  },
  historySection: {
    marginBottom: 32,
  },
  emptyState: {
    backgroundColor: Colors.warmPaper,
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    transform: [{ rotate: '0.3deg' }],
  },
  emptyIllustration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    opacity: 0.8,
  },
  emptyStateTitle: {
    ...Typography.h1,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
    color: Colors.deepCharcoal,
  },
  emptyStateText: {
    ...Typography.bodyLarge,
    color: Colors.mediumStone,
    textAlign: 'center',
    lineHeight: 24,
  },
  quizSection: {
    marginBottom: 32,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  quizIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.saffronGold08,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizContent: {
    flex: 1,
    gap: 4,
  },
  quizTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginBottom: 4,
  },
  quizDescription: {
    ...Typography.body,
    color: Colors.mediumStone,
    fontSize: 14,
    lineHeight: 20,
  },
  lastQuizDate: {
    ...Typography.caption,
    color: Colors.saffronGold,
    fontWeight: '600',
    marginTop: 4,
  },
});

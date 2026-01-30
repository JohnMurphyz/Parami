import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { loadQuizResults } from '../services/storageService';
import { getParamiById } from '../services/firebaseContentService';
import { getStrongestParamis, getParamisToDevelop } from '../utils/quizScoring';
import { QuizResult } from '../types';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import ScreenHeader from '../components/common/ScreenHeader';

export default function QuizHistoryScreen() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  // Reload when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadResults();
    }, [])
  );

  const loadResults = async () => {
    try {
      setLoading(true);
      const quizResults = await loadQuizResults();
      // Sort by most recent first
      const sorted = quizResults.sort((a, b) =>
        b.completedAt.localeCompare(a.completedAt)
      );
      setResults(sorted);
    } catch (error) {
      console.error('Error loading quiz results:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
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
        <ScreenHeader
          title="Your Results"
          subtitle={`${results.length} diagnostic${results.length !== 1 ? 's' : ''} completed`}
          onBack={() => router.back()}
        />

        {/* Take Another Quiz Button */}
        <TouchableOpacity
          style={styles.takeAnotherQuizButton}
          onPress={() => router.push('/quiz')}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={20} color={Colors.saffronGold} />
          <Text style={styles.takeAnotherQuizText}>Take Another Diagnostic</Text>
        </TouchableOpacity>

        {results.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="compass-outline" size={48} color={Colors.saffronGold} style={{ opacity: 0.4 }} />
            <Text style={styles.emptyStateTitle}>No Results Yet</Text>
            <Text style={styles.emptyStateText}>
              Your diagnostic results will appear here after you complete The Crossing Over Diagnostic.
            </Text>
          </View>
        ) : (
          results.map((result) => {
            const strongest = getStrongestParamis(result.scores);
            const weakest = getParamisToDevelop(result.scores);

            const strongestParami = strongest[0] ? getParamiById(strongest[0].paramiId) : null;
            const weakestParami = weakest[0] ? getParamiById(weakest[0].paramiId) : null;

            const avgScore = Math.round(
              result.scores.reduce((sum, s) => sum + s.normalizedScore, 0) / result.scores.length
            );

            return (
              <TouchableOpacity
                key={result.id}
                style={styles.resultCard}
                onPress={() => router.push(`/quiz-results/${result.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.resultHeader}>
                  <View>
                    <Text style={styles.resultDate}>{formatDate(result.completedAt)}</Text>
                    <Text style={styles.resultTime}>{formatTime(result.completedAt)}</Text>
                  </View>
                  <View style={styles.avgScoreContainer}>
                    <Text style={styles.avgScoreNumber}>{avgScore}</Text>
                    <Text style={styles.avgScoreLabel}>Avg</Text>
                  </View>
                </View>

                <View style={styles.resultDetails}>
                  {strongestParami && (
                    <View style={styles.detailRow}>
                      <Ionicons name="arrow-up-circle" size={16} color={Colors.deepMoss} />
                      <Text style={styles.detailLabel}>Strongest:</Text>
                      <Text style={styles.detailValue}>
                        {strongestParami.englishName} ({strongest[0].normalizedScore})
                      </Text>
                    </View>
                  )}
                  {weakestParami && (
                    <View style={styles.detailRow}>
                      <Ionicons name="arrow-down-circle" size={16} color={Colors.lotusPink} />
                      <Text style={styles.detailLabel}>Developing:</Text>
                      <Text style={styles.detailValue}>
                        {weakestParami.englishName} ({weakest[0].normalizedScore})
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.viewResultsRow}>
                  <Text style={styles.viewResultsText}>View Full Results</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.saffronGold} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },
  takeAnotherQuizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.saffronGold08,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.saffronGold40,
  },
  takeAnotherQuizText: {
    ...Typography.body,
    color: Colors.saffronGold,
    fontWeight: '600',
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
    marginTop: 40,
    transform: [{ rotate: '0.3deg' }],
  },
  emptyStateTitle: {
    ...Typography.h1,
    fontSize: 22,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    ...Typography.bodyLarge,
    color: Colors.mediumStone,
    textAlign: 'center',
    lineHeight: 24,
  },
  resultCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softAsh,
  },
  resultDate: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginBottom: 2,
  },
  resultTime: {
    ...Typography.caption,
    color: Colors.mediumStone,
  },
  avgScoreContainer: {
    alignItems: 'center',
    backgroundColor: Colors.saffronGold08,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  avgScoreNumber: {
    ...Typography.h1,
    fontSize: 24,
    color: Colors.saffronGold,
    fontWeight: '700',
  },
  avgScoreLabel: {
    ...Typography.caption,
    color: Colors.saffronGold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  resultDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.mediumStone,
    fontWeight: '600',
  },
  detailValue: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    flex: 1,
  },
  viewResultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 8,
  },
  viewResultsText: {
    ...Typography.caption,
    color: Colors.saffronGold,
    fontWeight: '600',
  },
});

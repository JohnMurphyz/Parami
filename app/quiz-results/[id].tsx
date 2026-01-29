import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getQuizResultById } from '../../services/storageService';
import { getParamiById } from '../../services/firebaseContentService';
import { generateInsights, getOverallAssessment, getPersonalizedRecommendation } from '../../utils/quizInsights';
import { getParamisToDevelop } from '../../utils/quizScoring';
import { QuizResult } from '../../types';
import QuizRadarChart from '../../components/QuizRadarChart';
import ParamiScoreRow from '../../components/ParamiScoreRow';
import ParamiDetailModal from '../../components/ParamiDetailModal';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

export default function QuizResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedParamiId, setSelectedParamiId] = useState<number | null>(null);
  const [selectedParamiScore, setSelectedParamiScore] = useState<number>(0);

  useEffect(() => {
    loadQuizResult();
  }, [id]);

  const loadQuizResult = async () => {
    try {
      setLoading(true);
      if (!id) return;

      const quizResult = await getQuizResultById(id);
      if (quizResult) {
        setResult(quizResult);
      }
    } catch (error) {
      console.error('Error loading quiz result:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleParamiPress = (paramiId: number, score: number) => {
    setSelectedParamiId(paramiId);
    setSelectedParamiScore(score);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.saffronGold} />
      </View>
    );
  }

  if (!result) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Quiz result not found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get all paramis for insights
  const allParamis = result.scores.map((score) => getParamiById(score.paramiId)!).filter(Boolean);

  // Generate insights
  const insights = generateInsights(result.scores, allParamis);
  const strengthInsight = insights.find((i) => i.category === 'strength');
  const developingInsight = insights.find((i) => i.category === 'developing');

  // Get overall assessment
  const assessment = getOverallAssessment(result.scores);

  // Get ranked scores (highest to lowest)
  const rankedScores = [...result.scores].sort((a, b) => b.normalizedScore - a.normalizedScore);

  // Get weakest parami for personalized recommendation
  const weakestParami = getParamisToDevelop(result.scores)[0];
  const weakestParamiData = weakestParami ? getParamiById(weakestParami.paramiId) : null;
  const personalizedRec = weakestParami && weakestParamiData
    ? getPersonalizedRecommendation(weakestParami, weakestParamiData)
    : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.completionIcon}>
            <Ionicons name="checkmark-circle" size={48} color={Colors.saffronGold} />
          </View>
          <Text style={styles.heroTitle}>Diagnostic Complete</Text>
          <Text style={styles.heroDate}>{formatDate(result.completedAt)}</Text>
          <Text style={styles.heroMessage}>{assessment}</Text>
        </View>

        {/* Radar Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Parami Profile</Text>
          <View style={styles.chartContainer}>
            <QuizRadarChart scores={result.scores} size={300} />
          </View>
        </View>

        {/* Ranked List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Paramis</Text>
          {rankedScores.map((score, index) => (
            <ParamiScoreRow
              key={score.paramiId}
              score={score}
              rank={index + 1}
              onPress={() => handleParamiPress(score.paramiId, score.normalizedScore)}
            />
          ))}
        </View>

        {/* Strengths */}
        {strengthInsight && strengthInsight.paramis.length > 0 && (
          <View style={styles.section}>
            <View style={styles.insightHeader}>
              <Ionicons name="star" size={24} color={Colors.deepMoss} />
              <Text style={styles.sectionTitle}>Your Strengths</Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightMessage}>{strengthInsight.message}</Text>
              {strengthInsight.teachings.length > 0 && (
                <View style={styles.teachingContainer}>
                  <Text style={styles.teachingText}>
                    {strengthInsight.teachings[0]}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Areas to Develop */}
        {developingInsight && developingInsight.paramis.length > 0 && (
          <View style={styles.section}>
            <View style={styles.insightHeader}>
              <Ionicons name="leaf" size={24} color={Colors.lotusPink} />
              <Text style={styles.sectionTitle}>Areas to Develop</Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightMessage}>{developingInsight.message}</Text>
              {developingInsight.teachings.length > 0 && (
                <View style={styles.teachingContainer}>
                  <Text style={styles.teachingText}>
                    {developingInsight.teachings[0]}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Personalized Recommendation */}
        {personalizedRec && (
          <View style={styles.section}>
            <View style={styles.insightHeader}>
              <Ionicons name="bulb" size={24} color={Colors.saffronGold} />
              <Text style={styles.sectionTitle}>Your Next Step</Text>
            </View>
            <View style={styles.recommendationCard}>
              <Text style={styles.insightMessage}>{personalizedRec}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.replace('/(tabs)/journey')}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>Return to Journey</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/quiz-history')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>View All Results</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Parami Detail Modal */}
      <ParamiDetailModal
        visible={selectedParamiId !== null}
        paramiId={selectedParamiId}
        score={selectedParamiScore}
        onClose={() => setSelectedParamiId(null)}
      />
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
    paddingTop: 60,
    paddingBottom: 48,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  completionIcon: {
    marginBottom: 16,
  },
  heroTitle: {
    ...Typography.h1,
    fontSize: 32,
    marginBottom: 8,
  },
  heroDate: {
    ...Typography.caption,
    color: Colors.mediumStone,
    marginBottom: 16,
  },
  heroMessage: {
    ...Typography.bodyLarge,
    color: Colors.deepStone,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...Typography.h2,
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  recommendationCard: {
    backgroundColor: Colors.saffronGold08,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.saffronGold,
  },
  insightMessage: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    lineHeight: 22,
    marginBottom: 16,
  },
  teachingContainer: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.lotusPink,
    paddingLeft: 16,
    paddingVertical: 8,
  },
  teachingText: {
    ...Typography.quote,
    color: Colors.deepStone,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  actionsSection: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.saffronGold,
  },
  secondaryButton: {
    backgroundColor: Colors.pureWhite,
    borderWidth: 1,
    borderColor: Colors.softAsh,
  },
  primaryButtonText: {
    ...Typography.body,
    color: Colors.pureWhite,
    fontWeight: '600',
  },
  secondaryButtonText: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    fontWeight: '600',
  },
  errorText: {
    ...Typography.body,
    color: Colors.deepStone,
    marginBottom: 16,
  },
});

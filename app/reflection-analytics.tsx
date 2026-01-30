import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { loadStructuredReflections } from '../services/storageService';
import { calculateAnalytics, AnalyticsSummary } from '../utils/reflectionAnalytics';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { logger } from '../utils/logger';
import ScreenHeader from '../components/common/ScreenHeader';
import EmotionalTimelineChart from '../components/reflection/analytics/EmotionalTimelineChart';
import ResilienceMeter from '../components/reflection/analytics/ResilienceMeter';
import GardenProgressCard from '../components/reflection/analytics/GardenProgressCard';
import EgoPatternInsights from '../components/reflection/analytics/EgoPatternInsights';
import SecondArrowTracker from '../components/reflection/analytics/SecondArrowTracker';

export default function ReflectionAnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const reflections = await loadStructuredReflections();
      const analyticsData = calculateAnalytics(reflections);
      setAnalytics(analyticsData);
      logger.info('Analytics loaded', { totalReflections: reflections.length });
    } catch (error) {
      logger.error('Error loading analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.saffronGold} />
        <Text style={styles.loadingText}>Calculating insights...</Text>
      </View>
    );
  }

  if (!analytics || analytics.totalReflections === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Reflection Analytics"
          subtitle="Track your spiritual journey"
          onBack={() => router.back()}
        />
        <View style={styles.emptyState}>
          <View style={styles.emptyIllustration}>
            <Ionicons name="analytics-outline" size={64} color={Colors.lotusPink} style={{ opacity: 0.3 }} />
          </View>
          <Text style={styles.emptyTitle}>No Analytics Yet</Text>
          <Text style={styles.emptyText}>
            Complete a few deep reflections to see your spiritual patterns and progress. Analytics will show after you've completed at least 3 reflections.
          </Text>
          <View style={styles.emptyTip}>
            <Ionicons name="bulb-outline" size={20} color={Colors.saffronGold} />
            <Text style={styles.emptyTipText}>
              Visit the Journey tab and click "Begin Deep Reflection" to start tracking your practice.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const { dateRange, totalReflections, emotionalTrends, averageResilience, resilienceTrend, gardenProgress, egoPatterns, secondArrowStats } = analytics;

  // Format date range
  const formatDateRange = (): string => {
    if (!dateRange) return '';
    const start = new Date(dateRange.earliest);
    const end = new Date(dateRange.latest);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <ScreenHeader
          title="Reflection Analytics"
          subtitle={`${totalReflections} deep reflections • ${formatDateRange()}`}
          onBack={() => router.back()}
        />

        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <Ionicons name="leaf" size={32} color={Colors.saffronGold} />
          <View style={styles.overviewContent}>
            <Text style={styles.overviewTitle}>Your Practice is Growing</Text>
            <Text style={styles.overviewText}>
              You've completed <Text style={styles.bold}>{totalReflections} deep reflections</Text>.
              These insights reveal patterns in your spiritual journey. Use them to deepen your practice.
            </Text>
          </View>
        </View>

        {/* Emotional Timeline */}
        <View style={styles.section}>
          <EmotionalTimelineChart trends={emotionalTrends} />
        </View>

        {/* Resilience Meter */}
        <View style={styles.section}>
          <ResilienceMeter
            averageResilience={averageResilience}
            trend={resilienceTrend}
            totalReflections={totalReflections}
          />
        </View>

        {/* Garden Progress */}
        <View style={styles.section}>
          <GardenProgressCard gardenProgress={gardenProgress} />
        </View>

        {/* Ego Patterns */}
        <View style={styles.section}>
          <EgoPatternInsights egoPatterns={egoPatterns} />
        </View>

        {/* Second Arrow Tracker */}
        <View style={styles.section}>
          <SecondArrowTracker secondArrowStats={secondArrowStats} />
        </View>

        {/* Closing Encouragement */}
        <View style={styles.closingCard}>
          <Ionicons name="heart" size={24} color={Colors.lotusPink} />
          <View style={styles.closingContent}>
            <Text style={styles.closingTitle}>Continue Your Practice</Text>
            <Text style={styles.closingText}>
              These patterns are not judgments—they're mirrors. The Buddha taught that awareness itself transforms. By seeing clearly, you're already on the path.
            </Text>
            <Text style={styles.closingQuote}>
              "No one saves us but ourselves. No one can and no one may. We ourselves must walk the path."
            </Text>
            <Text style={styles.closingAuthor}>— The Buddha (Dhp 165)</Text>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmPaper,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.deepStone,
    marginTop: 16,
  },
  overviewCard: {
    flexDirection: 'row',
    backgroundColor: Colors.pureWhite,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    gap: 16,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewContent: {
    flex: 1,
    gap: 8,
  },
  overviewTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
  },
  overviewText: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
    color: Colors.deepCharcoal,
  },
  section: {
    marginBottom: 20,
  },
  closingCard: {
    flexDirection: 'row',
    backgroundColor: Colors.lotusPink12,
    borderRadius: 18,
    padding: 24,
    gap: 16,
  },
  closingContent: {
    flex: 1,
    gap: 12,
  },
  closingTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
  },
  closingText: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 22,
  },
  closingQuote: {
    ...Typography.body,
    fontStyle: 'italic',
    color: Colors.deepCharcoal,
    marginTop: 8,
  },
  closingAuthor: {
    ...Typography.caption,
    color: Colors.deepStone,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIllustration: {
    marginBottom: 24,
  },
  emptyTitle: {
    ...Typography.h1,
    color: Colors.deepCharcoal,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.deepStone,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyTip: {
    flexDirection: 'row',
    backgroundColor: Colors.saffronGold08,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.saffronGold,
  },
  emptyTipText: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    lineHeight: 20,
    flex: 1,
  },
});

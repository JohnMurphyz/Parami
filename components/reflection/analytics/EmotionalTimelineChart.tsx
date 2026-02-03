import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmotionalTrend } from '../../../utils/reflectionAnalytics';
import { EmotionalState } from '../../../types';
import { Colors } from '../../../constants/Colors';
import { Typography } from '../../../constants/Typography';

interface EmotionalTimelineChartProps {
  trends: EmotionalTrend[];
}

const EMOTIONAL_STATE_COLORS: Record<EmotionalState, string> = {
  peaceful: Colors.emotionalPeaceful,
  grateful: Colors.emotionalGrateful,
  challenged: Colors.emotionalChallenged,
  restless: Colors.emotionalRestless,
  discouraged: Colors.emotionalDiscouraged,
};

const EMOTIONAL_STATE_LABELS: Record<EmotionalState, string> = {
  peaceful: 'Peaceful',
  grateful: 'Grateful',
  challenged: 'Challenged',
  restless: 'Restless',
  discouraged: 'Discouraged',
};

export default function EmotionalTimelineChart({ trends }: EmotionalTimelineChartProps) {
  if (trends.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="analytics-outline" size={48} color={Colors.mediumStone} style={{ opacity: 0.3 }} />
        <Text style={styles.emptyText}>No emotional data yet</Text>
      </View>
    );
  }

  // Calculate emotion frequencies
  const emotionCounts: Record<EmotionalState, number> = {
    peaceful: 0,
    grateful: 0,
    challenged: 0,
    restless: 0,
    discouraged: 0,
  };

  trends.forEach((trend) => {
    emotionCounts[trend.emotionalState]++;
  });

  // Sort by frequency
  const sortedEmotions = (Object.keys(emotionCounts) as EmotionalState[])
    .map((state) => ({
      state,
      count: emotionCounts[state],
      percentage: Math.round((emotionCounts[state] / trends.length) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .filter((e) => e.count > 0);

  const mostCommon = sortedEmotions[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emotional Patterns</Text>
        <Text style={styles.subtitle}>Your most common states</Text>
      </View>

      {/* Most Common Emotion */}
      <View style={styles.primaryEmotion}>
        <View
          style={[
            styles.emotionIndicator,
            { backgroundColor: EMOTIONAL_STATE_COLORS[mostCommon.state] },
          ]}
        />
        <View style={styles.emotionContent}>
          <Text style={styles.emotionLabel}>Most Common</Text>
          <Text style={styles.emotionValue}>{EMOTIONAL_STATE_LABELS[mostCommon.state]}</Text>
          <Text style={styles.emotionPercentage}>
            {mostCommon.count} times ({mostCommon.percentage}%)
          </Text>
        </View>
      </View>

      {/* All Emotions List */}
      <View style={styles.emotionList}>
        {sortedEmotions.map((emotion) => (
          <View key={emotion.state} style={styles.emotionRow}>
            <View
              style={[
                styles.emotionDot,
                { backgroundColor: EMOTIONAL_STATE_COLORS[emotion.state] },
              ]}
            />
            <Text style={styles.emotionName}>{EMOTIONAL_STATE_LABELS[emotion.state]}</Text>
            <View style={styles.emotionStats}>
              <Text style={styles.emotionCount}>{emotion.count}</Text>
              <Text style={styles.emotionPercent}>{emotion.percentage}%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 18,
    padding: 20,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.deepStone,
  },
  primaryEmotion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  emotionIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.8,
  },
  emotionContent: {
    flex: 1,
    gap: 2,
  },
  emotionLabel: {
    ...Typography.caption,
    color: Colors.mediumStone,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emotionValue: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    fontSize: 20,
  },
  emotionPercentage: {
    ...Typography.caption,
    color: Colors.deepStone,
    fontSize: 13,
  },
  emotionList: {
    gap: 12,
  },
  emotionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  emotionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emotionName: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    flex: 1,
  },
  emotionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emotionCount: {
    ...Typography.body,
    color: Colors.deepStone,
    fontWeight: '600',
  },
  emotionPercent: {
    ...Typography.caption,
    color: Colors.mediumStone,
    minWidth: 40,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.mediumStone,
  },
});

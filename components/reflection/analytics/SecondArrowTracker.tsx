import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SecondArrowStats } from '../../../utils/reflectionAnalytics';
import { Colors } from '../../../constants/Colors';
import { Typography } from '../../../constants/Typography';

interface SecondArrowTrackerProps {
  secondArrowStats: SecondArrowStats;
}

export default function SecondArrowTracker({ secondArrowStats }: SecondArrowTrackerProps) {
  const { frequency, occurrences, totalDays, trend } = secondArrowStats;

  const getTrendIcon = (): keyof typeof Ionicons.glyphMap => {
    if (trend === 'improving') return 'trending-down'; // Fewer second arrows = improvement
    if (trend === 'worsening') return 'trending-up'; // More second arrows = worsening
    return 'remove';
  };

  const getTrendColor = (): string => {
    if (trend === 'improving') return Colors.deepMoss;
    if (trend === 'worsening') return Colors.lotusPink;
    return Colors.mediumStone;
  };

  const getTrendLabel = (): string => {
    if (trend === 'improving') return 'Improving';
    if (trend === 'worsening') return 'Needs Attention';
    return 'Stable';
  };

  const getTrendMessage = (): string => {
    if (trend === 'improving') {
      return 'You\'re catching the second arrow more often. This awareness is the path to freedom from unnecessary suffering.';
    }
    if (trend === 'worsening') {
      return 'You\'re adding more mental grief lately. Remember: pain is inevitable, but suffering is optional.';
    }
    return 'Your pattern is stable. Continue observing when you add mental stories to physical pain.';
  };

  const getFrequencyLevel = (): 'low' | 'medium' | 'high' => {
    if (frequency < 30) return 'low';
    if (frequency < 60) return 'medium';
    return 'high';
  };

  const frequencyLevel = getFrequencyLevel();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="git-compare-outline" size={24} color={Colors.lotusPink} />
          <Text style={styles.title}>The Second Arrow</Text>
        </View>
        <Text style={styles.subtitle}>Tracking mental grief added to pain</Text>
      </View>

      {/* Main Stat Card */}
      <View style={styles.mainCard}>
        <View style={styles.mainStat}>
          <Text style={[styles.frequencyNumber, { color: getTrendColor() }]}>
            {frequency.toFixed(0)}%
          </Text>
          <Text style={styles.frequencyLabel}>of the time</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="flag" size={20} color={Colors.deepStone} />
            <Text style={styles.statValue}>{occurrences}</Text>
            <Text style={styles.statLabel}>Occurrences</Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name={getTrendIcon()} size={20} color={getTrendColor()} />
            <Text style={[styles.statValue, { color: getTrendColor() }]}>
              {getTrendLabel()}
            </Text>
            <Text style={styles.statLabel}>Trend</Text>
          </View>
        </View>
      </View>

      {/* Frequency Level Indicator */}
      <View style={styles.levelIndicator}>
        <View style={styles.levelBar}>
          <View
            style={[
              styles.levelSegment,
              styles.levelLow,
              frequencyLevel === 'low' && styles.levelActive,
            ]}
          >
            <Text style={[styles.levelText, frequencyLevel === 'low' && styles.levelTextActive]}>
              Low
            </Text>
          </View>
          <View
            style={[
              styles.levelSegment,
              styles.levelMedium,
              frequencyLevel === 'medium' && styles.levelActive,
            ]}
          >
            <Text style={[styles.levelText, frequencyLevel === 'medium' && styles.levelTextActive]}>
              Medium
            </Text>
          </View>
          <View
            style={[
              styles.levelSegment,
              styles.levelHigh,
              frequencyLevel === 'high' && styles.levelActive,
            ]}
          >
            <Text style={[styles.levelText, frequencyLevel === 'high' && styles.levelTextActive]}>
              High
            </Text>
          </View>
        </View>
        <Text style={styles.levelDescription}>
          {frequencyLevel === 'low' && 'Good awareness - you rarely add unnecessary suffering'}
          {frequencyLevel === 'medium' && 'Moderate awareness - room for improvement'}
          {frequencyLevel === 'high' && 'Frequent addition of mental grief - opportunity for practice'}
        </Text>
      </View>

      {/* Trend Message */}
      <View style={[styles.trendBox, { borderLeftColor: getTrendColor() }]}>
        <Ionicons name={getTrendIcon()} size={20} color={getTrendColor()} />
        <Text style={styles.trendMessage}>{getTrendMessage()}</Text>
      </View>

      {/* Teaching Section */}
      <View style={styles.teachingBox}>
        <Text style={styles.teachingTitle}>The Two Arrows Teaching</Text>
        <Text style={styles.teachingText}>
          The Buddha taught that when struck by an arrow (physical pain), we often shoot ourselves with a second arrow (mental anguish, resentment, anxiety).
        </Text>
        <Text style={styles.teachingText}>
          The first arrow is unavoidable. The second arrow is optional.
        </Text>
        <Text style={styles.teachingQuote}>
          "Pain is inevitable. Suffering is optional."
        </Text>
      </View>

      {/* Practice Reminder */}
      <View style={styles.practiceBox}>
        <View style={styles.practiceHeader}>
          <Ionicons name="fitness" size={20} color={Colors.saffronGold} />
          <Text style={styles.practiceTitle}>Practice Point</Text>
        </View>
        <Text style={styles.practiceText}>
          When pain arises (physical or emotional), pause. Notice if you're adding a story, blame, or resistance. That's the second arrow. Just notice it.
        </Text>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.deepStone,
  },
  mainCard: {
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: 16,
  },
  frequencyNumber: {
    ...Typography.h1,
    fontSize: 48,
    fontWeight: '700',
  },
  frequencyLabel: {
    ...Typography.body,
    color: Colors.deepStone,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.softAsh,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.mediumStone,
    fontSize: 11,
  },
  levelIndicator: {
    marginBottom: 16,
  },
  levelBar: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  levelSegment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  levelActive: {
    opacity: 1,
  },
  levelLow: {
    backgroundColor: Colors.deepMoss,
  },
  levelMedium: {
    backgroundColor: Colors.saffronGold,
  },
  levelHigh: {
    backgroundColor: Colors.lotusPink,
  },
  levelText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.pureWhite,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  levelTextActive: {
    fontSize: 12,
  },
  levelDescription: {
    ...Typography.caption,
    color: Colors.deepStone,
    textAlign: 'center',
    lineHeight: 18,
  },
  trendBox: {
    flexDirection: 'row',
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
  },
  trendMessage: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    lineHeight: 20,
    flex: 1,
  },
  teachingBox: {
    backgroundColor: Colors.saffronGold08,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  teachingTitle: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
  },
  teachingText: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 20,
  },
  teachingQuote: {
    ...Typography.body,
    fontStyle: 'italic',
    color: Colors.deepCharcoal,
    marginTop: 4,
  },
  practiceBox: {
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  practiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  practiceTitle: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
  },
  practiceText: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 20,
  },
});

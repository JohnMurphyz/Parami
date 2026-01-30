import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GardenProgress } from '../utils/reflectionAnalytics';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface GardenProgressCardProps {
  gardenProgress: GardenProgress;
}

export default function GardenProgressCard({ gardenProgress }: GardenProgressCardProps) {
  const wholesomeAnim = useRef(new Animated.Value(0)).current;
  const unwholesomeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(wholesomeAnim, {
        toValue: gardenProgress.ratio * 100,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }),
      Animated.spring(unwholesomeAnim, {
        toValue: (1 - gardenProgress.ratio) * 100,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }),
    ]).start();
  }, [gardenProgress.ratio]);

  const { wholesomeSeedsCount, unwholesomeSeedsCount, ratio, averageWholesomePerDay, averageUnwholesomePerDay } = gardenProgress;

  const wholesomePercentage = ratio * 100;
  const unwholesomePercentage = (1 - ratio) * 100;

  const getProgressMessage = (ratio: number): string => {
    if (ratio >= 0.7) return 'Excellent cultivation! Your garden flourishes with wholesome seeds.';
    if (ratio >= 0.5) return 'Balanced cultivation. Continue nurturing wholesome seeds.';
    return 'More attention needed. Focus on watering wholesome seeds.';
  };

  const getProgressColor = (ratio: number): string => {
    if (ratio >= 0.7) return Colors.deepMoss;
    if (ratio >= 0.5) return Colors.saffronGold;
    return Colors.lotusPink;
  };

  const progressColor = getProgressColor(ratio);
  const progressMessage = getProgressMessage(ratio);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="leaf" size={24} color={Colors.deepMoss} />
          <Text style={styles.title}>Garden Progress</Text>
        </View>
        <Text style={styles.subtitle}>Your mental seed cultivation ratio</Text>
      </View>

      {/* Ratio Bar Chart */}
      <View style={styles.barContainer}>
        <View style={styles.barLabels}>
          <Text style={styles.barLabel}>Wholesome</Text>
          <Text style={styles.barLabel}>Unwholesome</Text>
        </View>

        <View style={styles.bar}>
          {/* Wholesome bar */}
          <Animated.View
            style={[
              styles.barSegment,
              styles.barWholesome,
              {
                width: wholesomeAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
          {/* Unwholesome bar */}
          <Animated.View
            style={[
              styles.barSegment,
              styles.barUnwholesome,
              {
                width: unwholesomeAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>

        <View style={styles.barPercentages}>
          <Text style={[styles.percentage, { color: Colors.deepMoss }]}>
            {wholesomePercentage.toFixed(0)}%
          </Text>
          <Text style={[styles.percentage, { color: Colors.lotusPink }]}>
            {unwholesomePercentage.toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: Colors.deepMoss08 }]}>
            <Ionicons name="flower" size={20} color={Colors.deepMoss} />
          </View>
          <Text style={styles.statValue}>{wholesomeSeedsCount}</Text>
          <Text style={styles.statLabel}>Wholesome Seeds</Text>
          <Text style={styles.statSublabel}>
            {averageWholesomePerDay.toFixed(1)} per day
          </Text>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: Colors.lotusPink12 }]}>
            <Ionicons name="warning" size={20} color={Colors.lotusPink} />
          </View>
          <Text style={styles.statValue}>{unwholesomeSeedsCount}</Text>
          <Text style={styles.statLabel}>Unwholesome Seeds</Text>
          <Text style={styles.statSublabel}>
            {averageUnwholesomePerDay.toFixed(1)} per day
          </Text>
        </View>
      </View>

      {/* Progress Message */}
      <View style={[styles.messageBox, { borderLeftColor: progressColor }]}>
        <Ionicons
          name={ratio >= 0.7 ? 'checkmark-circle' : ratio >= 0.5 ? 'information-circle' : 'alert-circle'}
          size={20}
          color={progressColor}
        />
        <Text style={styles.messageText}>{progressMessage}</Text>
      </View>

      {/* Teaching Note */}
      <View style={styles.teachingBox}>
        <Text style={styles.teachingQuote}>
          "Whatever we frequently think and ponder upon, that will become the inclination of our mind."
        </Text>
        <Text style={styles.teachingAuthor}>— The Buddha (MN 19)</Text>
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
  barContainer: {
    gap: 12,
    marginBottom: 20,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.deepStone,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bar: {
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.warmStone,
    flexDirection: 'row',
  },
  barSegment: {
    height: '100%',
  },
  barWholesome: {
    backgroundColor: Colors.deepMoss,
  },
  barUnwholesome: {
    backgroundColor: Colors.lotusPink,
  },
  barPercentages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentage: {
    ...Typography.body,
    fontWeight: '700',
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: {
    ...Typography.h2,
    fontSize: 24,
    color: Colors.deepCharcoal,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.deepStone,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 11,
  },
  statSublabel: {
    ...Typography.caption,
    color: Colors.mediumStone,
    fontSize: 10,
  },
  messageBox: {
    flexDirection: 'row',
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderLeftWidth: 3,
    marginBottom: 16,
  },
  messageText: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    lineHeight: 20,
    flex: 1,
  },
  teachingBox: {
    backgroundColor: Colors.saffronGold08,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  teachingQuote: {
    ...Typography.body,
    fontStyle: 'italic',
    color: Colors.deepCharcoal,
    lineHeight: 22,
  },
  teachingAuthor: {
    ...Typography.caption,
    color: Colors.deepStone,
    fontWeight: '600',
  },
});

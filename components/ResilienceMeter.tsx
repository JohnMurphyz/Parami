import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface ResilienceMeterProps {
  averageResilience: number; // 1-3 scale (1=struggling, 2=wavering, 3=stable)
  trend: 'improving' | 'stable' | 'declining';
  totalReflections: number;
}

export default function ResilienceMeter({
  averageResilience,
  trend,
  totalReflections,
}: ResilienceMeterProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: averageResilience,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [averageResilience]);

  // Convert 1-3 scale to percentage (0-100)
  const percentage = ((averageResilience - 1) / 2) * 100;

  // Determine color based on resilience level
  const getResilienceColor = (value: number): string => {
    if (value >= 2.5) return Colors.deepMoss; // Stable
    if (value >= 1.8) return Colors.saffronGold; // Wavering
    return Colors.lotusPink; // Struggling
  };

  const getResilienceLabel = (value: number): string => {
    if (value >= 2.5) return 'Strong & Steady';
    if (value >= 2.2) return 'Generally Stable';
    if (value >= 1.8) return 'Sometimes Wavering';
    if (value >= 1.5) return 'Often Struggling';
    return 'Needs Support';
  };

  const getTrendIcon = (): keyof typeof Ionicons.glyphMap => {
    if (trend === 'improving') return 'trending-up';
    if (trend === 'declining') return 'trending-down';
    return 'remove';
  };

  const getTrendColor = (): string => {
    if (trend === 'improving') return Colors.deepMoss;
    if (trend === 'declining') return Colors.lotusPink;
    return Colors.mediumStone;
  };

  const getTrendLabel = (): string => {
    if (trend === 'improving') return 'Improving';
    if (trend === 'declining') return 'Declining';
    return 'Stable';
  };

  const resilienceColor = getResilienceColor(averageResilience);
  const resilienceLabel = getResilienceLabel(averageResilience);

  // Animated rotation for the arc
  const rotation = animatedValue.interpolate({
    inputRange: [1, 3],
    outputRange: ['-90deg', '90deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resilience Level</Text>
        <Text style={styles.subtitle}>Your capacity to work with difficulty</Text>
      </View>

      {/* Circular Meter */}
      <View style={styles.meterContainer}>
        {/* Background arc */}
        <View style={styles.arcBackground} />

        {/* Animated arc */}
        <Animated.View
          style={[
            styles.arc,
            {
              borderColor: resilienceColor,
              transform: [{ rotate: rotation }],
            },
          ]}
        />

        {/* Center content */}
        <View style={styles.centerContent}>
          <View style={[styles.scoreCircle, { borderColor: resilienceColor }]}>
            <Text style={[styles.scoreValue, { color: resilienceColor }]}>
              {averageResilience.toFixed(1)}
            </Text>
            <Text style={styles.scoreMax}>/3</Text>
          </View>
          <Text style={[styles.resilienceLabel, { color: resilienceColor }]}>
            {resilienceLabel}
          </Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {/* Trend indicator */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name={getTrendIcon()} size={20} color={getTrendColor()} />
            <Text style={styles.statLabel}>Trend</Text>
          </View>
          <Text style={[styles.statValue, { color: getTrendColor() }]}>
            {getTrendLabel()}
          </Text>
        </View>

        {/* Total reflections */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="calendar-outline" size={20} color={Colors.saffronGold} />
            <Text style={styles.statLabel}>Reflections</Text>
          </View>
          <Text style={styles.statValue}>{totalReflections}</Text>
        </View>
      </View>

      {/* Interpretation */}
      <View style={styles.interpretationBox}>
        <Ionicons name="information-circle-outline" size={20} color={Colors.deepStone} />
        <Text style={styles.interpretationText}>
          {averageResilience >= 2.5 &&
            'Your practice shows strong resilience. You\'re able to stay steady with life\'s ups and downs.'}
          {averageResilience >= 1.8 && averageResilience < 2.5 &&
            'Your resilience wavers but you\'re developing stability. Continue your practice with patience.'}
          {averageResilience < 1.8 &&
            'This is a challenging time. Remember: the path includes difficulties. Consider support from a spiritual friend.'}
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
    marginBottom: 24,
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
  meterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    position: 'relative',
  },
  arcBackground: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 12,
    borderColor: Colors.warmStone,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  arc: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  centerContent: {
    alignItems: 'center',
    gap: 8,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.warmPaper,
  },
  scoreValue: {
    ...Typography.h1,
    fontSize: 32,
    fontWeight: '700',
  },
  scoreMax: {
    ...Typography.caption,
    color: Colors.mediumStone,
    marginTop: -4,
  },
  resilienceLabel: {
    ...Typography.body,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.deepStone,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    ...Typography.body,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.deepCharcoal,
  },
  interpretationBox: {
    flexDirection: 'row',
    backgroundColor: Colors.saffronGold08,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 20,
    borderLeftWidth: 3,
    borderLeftColor: Colors.saffronGold,
  },
  interpretationText: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    lineHeight: 20,
    flex: 1,
  },
});

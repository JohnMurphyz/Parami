import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EgoPatterns } from '../../../utils/reflectionAnalytics';
import { Colors } from '../../../constants/Colors';
import { Typography } from '../../../constants/Typography';

interface EgoPatternInsightsProps {
  egoPatterns: EgoPatterns;
}

interface LordConfig {
  key: 'form' | 'speech' | 'mind';
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const LORDS: LordConfig[] = [
  {
    key: 'form',
    label: 'Lord of Form',
    description: 'Seeking neurotic comfort and security',
    icon: 'shield-outline',
    color: Colors.emotionalRestless,
  },
  {
    key: 'speech',
    label: 'Lord of Speech',
    description: 'Using intellect as a shield from experience',
    icon: 'chatbox-ellipses-outline',
    color: Colors.emotionalChallenged,
  },
  {
    key: 'mind',
    label: 'Lord of Mind',
    description: 'Using spirituality to feel special or superior',
    icon: 'bulb-outline',
    color: Colors.emotionalDiscouraged,
  },
];

export default function EgoPatternInsights({ egoPatterns }: EgoPatternInsightsProps) {
  const { lordOfForm, lordOfSpeech, lordOfMind, mostCommonLord } = egoPatterns;

  const getLordPercentage = (lord: 'form' | 'speech' | 'mind'): number => {
    if (lord === 'form') return lordOfForm;
    if (lord === 'speech') return lordOfSpeech;
    return lordOfMind;
  };

  const getMostCommonLordConfig = (): LordConfig | null => {
    if (!mostCommonLord) return null;
    return LORDS.find((l) => l.key === mostCommonLord) || null;
  };

  const mostCommon = getMostCommonLordConfig();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="eye" size={24} color={Colors.saffronGold} />
          <Text style={styles.title}>Ego Patterns</Text>
        </View>
        <Text style={styles.subtitle}>Three Lords of Materialism frequency</Text>
      </View>

      {/* Pattern Cards */}
      <View style={styles.patternsContainer}>
        {LORDS.map((lord) => {
          const percentage = getLordPercentage(lord.key);
          const isMostCommon = mostCommonLord === lord.key;

          return (
            <View
              key={lord.key}
              style={[
                styles.patternCard,
                isMostCommon && styles.patternCardHighlighted,
              ]}
            >
              <View style={styles.patternHeader}>
                <View style={[styles.iconCircle, { backgroundColor: `${lord.color}20` }]}>
                  <Ionicons name={lord.icon} size={24} color={lord.color} />
                </View>
                <View style={styles.patternInfo}>
                  <View style={styles.labelRow}>
                    <Text style={styles.patternLabel}>{lord.label}</Text>
                    {isMostCommon && (
                      <View style={styles.mostCommonBadge}>
                        <Text style={styles.mostCommonText}>Most Common</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.patternDescription}>{lord.description}</Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${percentage}%`,
                        backgroundColor: lord.color,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.percentageText, { color: lord.color }]}>
                  {percentage.toFixed(0)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Insight Box */}
      {mostCommon && (
        <View style={styles.insightBox}>
          <Ionicons name="bulb" size={20} color={Colors.saffronGold} />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Primary Pattern</Text>
            <Text style={styles.insightText}>
              Your ego most frequently manifests as the <Text style={styles.bold}>{mostCommon.label}</Text>.{' '}
              This is the pattern to watch most carefully in your practice.
            </Text>
          </View>
        </View>
      )}

      {/* Teaching Note */}
      <View style={styles.teachingBox}>
        <Text style={styles.teachingText}>
          <Text style={styles.bold}>Spiritual Materialism:</Text> Chögyam Trungpa taught that the ego can co-opt even spiritual practice.
          Genuine reflection requires honest assessment of how these patterns appear.
        </Text>
      </View>

      {/* Encouragement */}
      {egoPatterns.totalDays >= 7 && (
        <View style={styles.encouragementBox}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.deepMoss} />
          <Text style={styles.encouragementText}>
            You've tracked these patterns for {egoPatterns.totalDays} days. This self-awareness is the beginning of transformation.
          </Text>
        </View>
      )}
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
  patternsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  patternCard: {
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  patternCardHighlighted: {
    backgroundColor: Colors.saffronGold08,
    borderColor: Colors.saffronGold,
  },
  patternHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternInfo: {
    flex: 1,
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  patternLabel: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.deepCharcoal,
  },
  mostCommonBadge: {
    backgroundColor: Colors.saffronGold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  mostCommonText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.pureWhite,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  patternDescription: {
    ...Typography.caption,
    color: Colors.deepStone,
    lineHeight: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.warmStone,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    ...Typography.body,
    fontWeight: '700',
    fontSize: 16,
    minWidth: 40,
    textAlign: 'right',
  },
  insightBox: {
    flexDirection: 'row',
    backgroundColor: Colors.saffronGold08,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.saffronGold,
  },
  insightContent: {
    flex: 1,
    gap: 4,
  },
  insightTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.deepCharcoal,
  },
  insightText: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: Colors.deepCharcoal,
  },
  teachingBox: {
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  teachingText: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 20,
  },
  encouragementBox: {
    flexDirection: 'row',
    backgroundColor: Colors.deepMoss08,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  encouragementText: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    lineHeight: 20,
    flex: 1,
  },
});

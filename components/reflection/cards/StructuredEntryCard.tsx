import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StructuredReflection, EmotionalState } from '../../../types';
import { SimplifiedReflection } from '../../../types/simplifiedReflection';
import { Colors } from '../../../constants/Colors';
import { Typography } from '../../../constants/Typography';

interface StructuredEntryCardProps {
  entry: StructuredReflection | SimplifiedReflection;
  paramiName: string;
  onPress: () => void;
}

interface EmotionalStateDisplay {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
}

const EMOTIONAL_STATE_DISPLAY: Record<EmotionalState, EmotionalStateDisplay> = {
  peaceful: {
    icon: 'leaf',
    color: Colors.emotionalPeaceful,
    label: 'Peaceful',
  },
  grateful: {
    icon: 'heart',
    color: Colors.emotionalGrateful,
    label: 'Grateful',
  },
  challenged: {
    icon: 'flame',
    color: Colors.emotionalChallenged,
    label: 'Challenged',
  },
  restless: {
    icon: 'ellipsis-horizontal-circle',
    color: Colors.emotionalRestless,
    label: 'Restless',
  },
  discouraged: {
    icon: 'cloud',
    color: Colors.emotionalDiscouraged,
    label: 'Discouraged',
  },
};

export default function StructuredEntryCard({
  entry,
  paramiName,
  onPress,
}: StructuredEntryCardProps) {
  // Extract emotional state from the correct location
  const emotionalState: EmotionalState =
    entry.type === 'simplified'
      ? entry.reflectionIntegration?.emotionalState || 'peaceful'
      : entry.emotionalState || 'peaceful';

  const emotionalDisplay = EMOTIONAL_STATE_DISPLAY[emotionalState];

  // Count completed sections
  const completedCount = Object.values(entry.completedSections).filter(Boolean).length;
  const totalSections = Object.keys(entry.completedSections).length;
  const isComplete = completedCount === totalSections;

  // Format date
  const date = new Date(entry.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Get snippet of overall reflection (first 80 chars)
  const overallReflection =
    entry.type === 'simplified'
      ? entry.reflectionIntegration?.overallReflection
      : entry.overallReflection;

  const snippet = overallReflection
    ? overallReflection.length > 80
      ? `${overallReflection.substring(0, 80)}...`
      : overallReflection
    : 'No summary written';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Deep reflection from ${formattedDate}`}
      accessibilityRole="button"
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.emotionalIcon,
              { backgroundColor: `${emotionalDisplay.color}20` },
            ]}
          >
            <Ionicons
              name={emotionalDisplay.icon}
              size={20}
              color={emotionalDisplay.color}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.paramiName}>{paramiName}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>

        <View style={styles.headerBadges}>
          {isComplete ? (
            <View style={styles.completeBadge}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.deepMoss} />
              <Text style={styles.completeBadgeText}>Complete</Text>
            </View>
          ) : (
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>
                {completedCount}/{totalSections}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Snippet */}
      <Text style={styles.snippet} numberOfLines={2}>
        {snippet}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.emotionalTag}>
          <Ionicons
            name={emotionalDisplay.icon}
            size={14}
            color={emotionalDisplay.color}
          />
          <Text style={[styles.emotionalLabel, { color: emotionalDisplay.color }]}>
            {emotionalDisplay.label}
          </Text>
        </View>

        <View style={styles.viewMore}>
          <Text style={styles.viewMoreText}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.mediumStone} />
        </View>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.saffronGold,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emotionalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  paramiName: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.deepCharcoal,
  },
  date: {
    ...Typography.caption,
    color: Colors.deepStone,
    fontSize: 12,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.deepMoss08,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completeBadgeText: {
    ...Typography.caption,
    color: Colors.deepMoss,
    fontWeight: '700',
    fontSize: 11,
  },
  progressBadge: {
    backgroundColor: Colors.softAsh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBadgeText: {
    ...Typography.caption,
    color: Colors.deepStone,
    fontWeight: '700',
    fontSize: 11,
  },
  snippet: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emotionalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emotionalLabel: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 12,
  },
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewMoreText: {
    ...Typography.caption,
    color: Colors.mediumStone,
    fontWeight: '600',
    fontSize: 12,
  },
});

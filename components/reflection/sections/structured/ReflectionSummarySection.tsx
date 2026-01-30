import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmotionalState, ResilienceLevel } from '../../../../types';
import SectionContainer from '../../../common/SectionContainer';
import { Colors } from '../../../../constants/Colors';
import { Typography } from '../../../../constants/Typography';

interface ReflectionSummarySectionProps {
  emotionalState: EmotionalState;
  resilienceLevel: ResilienceLevel;
  overallReflection: string;
  onEmotionalStateChange: (state: EmotionalState) => void;
  onResilienceLevelChange: (level: ResilienceLevel) => void;
  onOverallReflectionChange: (text: string) => void;
}

interface EmotionalStateConfig {
  value: EmotionalState;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
}

interface ResilienceLevelConfig {
  value: ResilienceLevel;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const EMOTIONAL_STATES: EmotionalStateConfig[] = [
  {
    value: 'peaceful',
    label: 'Peaceful',
    icon: 'leaf-outline',
    color: Colors.emotionalPeaceful,
    description: 'Calm and centered',
  },
  {
    value: 'grateful',
    label: 'Grateful',
    icon: 'heart-outline',
    color: Colors.emotionalGrateful,
    description: 'Appreciative and warm',
  },
  {
    value: 'challenged',
    label: 'Challenged',
    icon: 'flame-outline',
    color: Colors.emotionalChallenged,
    description: 'Facing difficulties',
  },
  {
    value: 'restless',
    label: 'Restless',
    icon: 'ellipsis-horizontal-circle-outline',
    color: Colors.emotionalRestless,
    description: 'Unsettled and seeking',
  },
  {
    value: 'discouraged',
    label: 'Discouraged',
    icon: 'cloud-outline',
    color: Colors.emotionalDiscouraged,
    description: 'Heavy and disheartened',
  },
];

const RESILIENCE_LEVELS: ResilienceLevelConfig[] = [
  {
    value: 'stable',
    label: 'Stable',
    icon: 'shield-checkmark-outline',
    description: 'Steady and resilient',
  },
  {
    value: 'wavering',
    label: 'Wavering',
    icon: 'radio-button-on-outline',
    description: 'Some uncertainty',
  },
  {
    value: 'struggling',
    label: 'Struggling',
    icon: 'alert-circle-outline',
    description: 'Finding it difficult',
  },
];

export default function ReflectionSummarySection({
  emotionalState,
  resilienceLevel,
  overallReflection,
  onEmotionalStateChange,
  onResilienceLevelChange,
  onOverallReflectionChange,
}: ReflectionSummarySectionProps) {
  const isStruggling = resilienceLevel === 'struggling' || emotionalState === 'discouraged';

  return (
    <SectionContainer
      title="Reflection Summary"
      subtitle="Complete your reflection by noting your emotional state and overall insights from today."
      icon="checkmark-circle-outline"
    >
      {/* Emotional State Picker */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>How do you feel right now?</Text>
        <Text style={styles.helperText}>
          Select the emotional state that best describes your current experience.
        </Text>

        <View style={styles.emotionalStateGrid}>
          {EMOTIONAL_STATES.map((state) => {
            const isSelected = emotionalState === state.value;
            return (
              <TouchableOpacity
                key={state.value}
                style={[
                  styles.emotionalStateCard,
                  isSelected && styles.emotionalStateCardActive,
                  isSelected && { borderColor: state.color },
                ]}
                onPress={() => onEmotionalStateChange(state.value)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={`Emotional state: ${state.label}`}
              >
                <View
                  style={[
                    styles.emotionalStateIcon,
                    { backgroundColor: `${state.color}20` },
                  ]}
                >
                  <Ionicons name={state.icon} size={24} color={state.color} />
                </View>
                <Text
                  style={[
                    styles.emotionalStateLabel,
                    isSelected && { color: state.color },
                  ]}
                >
                  {state.label}
                </Text>
                <Text style={styles.emotionalStateDescription}>
                  {state.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Resilience Level Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>How is your resilience today?</Text>
        <Text style={styles.helperText}>
          Assess your capacity to work with difficulty.
        </Text>

        <View style={styles.resilienceGroup}>
          {RESILIENCE_LEVELS.map((level) => {
            const isSelected = resilienceLevel === level.value;
            return (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.resilienceCard,
                  isSelected && styles.resilienceCardActive,
                ]}
                onPress={() => onResilienceLevelChange(level.value)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={`Resilience level: ${level.label}`}
              >
                <Ionicons
                  name={level.icon}
                  size={28}
                  color={isSelected ? Colors.saffronGold : Colors.deepStone}
                />
                <View style={styles.resilienceContent}>
                  <Text
                    style={[
                      styles.resilienceLabel,
                      isSelected && styles.resilienceLabelActive,
                    ]}
                  >
                    {level.label}
                  </Text>
                  <Text style={styles.resilienceDescription}>
                    {level.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Overall Reflection */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Overall Reflection</Text>
        <Text style={styles.helperText}>
          What stands out from today's practice? What are you learning?
        </Text>

        <TextInput
          style={styles.textArea}
          value={overallReflection}
          onChangeText={onOverallReflectionChange}
          placeholder="Example: 'Today I noticed how much I resist discomfort. The practice is teaching me to stay present even when it's boring. I'm seeing patterns I never saw before...'"
          placeholderTextColor={Colors.mediumStone}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          accessibilityLabel="Overall reflection"
        />
      </View>

      {/* Mutual Support Encouragement */}
      <View style={styles.encouragementBox}>
        <View style={styles.encouragementHeader}>
          <Ionicons name="people-outline" size={24} color={Colors.saffronGold} />
          <Text style={styles.encouragementTitle}>You Don't Walk Alone</Text>
        </View>

        <Text style={styles.encouragementText}>
          The Buddha taught that the spiritual life is lived through mutual support and genuine friendship. If you're struggling, consider sharing with a spiritual friend or teacher.
        </Text>

        {isStruggling && (
          <View style={styles.encouragementHighlight}>
            <Ionicons name="hand-right-outline" size={20} color={Colors.lotusPink} />
            <Text style={styles.encouragementHighlightText}>
              You marked yourself as struggling or discouraged. Remember: this is part of the path. Consider reaching out to your spiritual community.
            </Text>
          </View>
        )}

        <Text style={styles.encouragementQuote}>
          "Spiritual friendship is the whole of the holy life."
        </Text>
        <Text style={styles.encouragementAuthor}>— The Buddha (AN 1.14)</Text>
      </View>
    </SectionContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionLabel: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
    marginBottom: 4,
  },
  helperText: {
    ...Typography.caption,
    color: Colors.mediumStone,
    lineHeight: 18,
    marginBottom: 8,
  },
  emotionalStateGrid: {
    gap: 12,
  },
  emotionalStateCard: {
    backgroundColor: Colors.warmStone,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emotionalStateCardActive: {
    backgroundColor: Colors.pureWhite,
    borderWidth: 2,
  },
  emotionalStateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emotionalStateLabel: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.deepCharcoal,
    flex: 1,
  },
  emotionalStateDescription: {
    ...Typography.caption,
    color: Colors.deepStone,
  },
  resilienceGroup: {
    gap: 12,
  },
  resilienceCard: {
    backgroundColor: Colors.warmStone,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resilienceCardActive: {
    backgroundColor: Colors.saffronGold08,
    borderWidth: 2,
    borderColor: Colors.saffronGold,
  },
  resilienceContent: {
    flex: 1,
    gap: 2,
  },
  resilienceLabel: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.deepStone,
  },
  resilienceLabelActive: {
    color: Colors.deepCharcoal,
  },
  resilienceDescription: {
    ...Typography.caption,
    color: Colors.mediumStone,
    fontSize: 13,
  },
  textArea: {
    ...Typography.body,
    backgroundColor: Colors.pureWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.softAsh,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  encouragementBox: {
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.softAsh,
  },
  encouragementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  encouragementTitle: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
  },
  encouragementText: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 22,
  },
  encouragementHighlight: {
    backgroundColor: Colors.lotusPink12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.lotusPink,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  encouragementHighlightText: {
    ...Typography.caption,
    color: Colors.deepCharcoal,
    lineHeight: 20,
    flex: 1,
  },
  encouragementQuote: {
    ...Typography.body,
    fontStyle: 'italic',
    color: Colors.deepCharcoal,
    marginTop: 4,
  },
  encouragementAuthor: {
    ...Typography.caption,
    color: Colors.deepStone,
    fontWeight: '600',
  },
});

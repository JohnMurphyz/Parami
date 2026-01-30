import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReflectionIntegrationData } from '../types/simplifiedReflection';
import { EmotionalState, ResilienceLevel } from '../types';
import SectionContainer from './SectionContainer';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface ReflectionIntegrationSectionProps {
  data: ReflectionIntegrationData;
  onChange: (data: ReflectionIntegrationData) => void;
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

export default function ReflectionIntegrationSection({
  data,
  onChange
}: ReflectionIntegrationSectionProps) {
  const isStruggling = data.resilienceLevel === 'struggling' || data.emotionalState === 'discouraged';

  return (
    <SectionContainer
      title="Reflection & Integration"
      subtitle="Synthesize insights, assess your state, and capture what you're learning."
      icon="sparkles-outline"
    >
      {/* Essential Questions */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>When did you stop and be fully present today?</Text>
        <Text style={styles.helperText}>
          Moments of mindfulness, clarity, or simply stopping to be here now
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          value={data.essentialQuestions.presence}
          onChangeText={(text) => onChange({
            ...data,
            essentialQuestions: {
              ...data.essentialQuestions,
              presence: text,
            },
          })}
          placeholder="Describe moments of presence..."
          placeholderTextColor={Colors.mediumStone}
          maxLength={200}
        />
        <Text style={styles.charCount}>
          {data.essentialQuestions.presence.length}/200
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>What did you release or work with today?</Text>
        <Text style={styles.helperText}>
          Attachments released, patterns worked with, or steps toward self-reliance
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          value={data.essentialQuestions.lettingGo}
          onChangeText={(text) => onChange({
            ...data,
            essentialQuestions: {
              ...data.essentialQuestions,
              lettingGo: text,
            },
          })}
          placeholder="Describe what you released or worked with..."
          placeholderTextColor={Colors.mediumStone}
          maxLength={200}
        />
        <Text style={styles.charCount}>
          {data.essentialQuestions.lettingGo.length}/200
        </Text>
      </View>

      {/* Emotional State Picker */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>How do you feel right now?</Text>
        <Text style={styles.helperText}>
          Select the emotional state that best describes your current experience
        </Text>

        <View style={styles.emotionalStateGrid}>
          {EMOTIONAL_STATES.map((state) => {
            const isSelected = data.emotionalState === state.value;
            return (
              <TouchableOpacity
                key={state.value}
                style={[
                  styles.emotionalStateCard,
                  isSelected && styles.emotionalStateCardActive,
                  isSelected && { borderColor: state.color },
                ]}
                onPress={() => onChange({ ...data, emotionalState: state.value })}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Ionicons
                  name={state.icon}
                  size={24}
                  color={isSelected ? state.color : Colors.mediumStone}
                />
                <Text
                  style={[
                    styles.emotionalStateLabel,
                    isSelected && styles.emotionalStateLabelActive,
                  ]}
                >
                  {state.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Resilience Level Picker */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>How resilient did you feel today?</Text>
        <Text style={styles.helperText}>
          Assess your ability to meet life's ups and downs with equanimity
        </Text>

        <View style={styles.resilienceOptions}>
          {RESILIENCE_LEVELS.map((level) => {
            const isSelected = data.resilienceLevel === level.value;
            return (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.resilienceCard,
                  isSelected && styles.resilienceCardActive,
                ]}
                onPress={() => onChange({ ...data, resilienceLevel: level.value })}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Ionicons
                  name={level.icon}
                  size={24}
                  color={isSelected ? Colors.saffronGold : Colors.mediumStone}
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
        <Text style={styles.sectionLabel}>What stands out from today's practice?</Text>
        <Text style={styles.helperText}>
          What are you learning? What insights emerged?
        </Text>
        <TextInput
          style={[styles.textArea, styles.overallTextArea]}
          multiline
          numberOfLines={6}
          value={data.overallReflection}
          onChangeText={(text) => onChange({ ...data, overallReflection: text })}
          placeholder="Capture your insights, learnings, or observations..."
          placeholderTextColor={Colors.mediumStone}
          maxLength={600}
        />
        <Text style={styles.charCount}>
          {data.overallReflection.length}/600
        </Text>
      </View>

      {/* Encouragement for struggling users */}
      {isStruggling && (
        <View style={styles.encouragementBox}>
          <Ionicons name="heart" size={20} color={Colors.lotusPink} />
          <Text style={styles.encouragementText}>
            Difficult days are part of the path. The fact that you're reflecting shows courage and commitment to your practice.
          </Text>
        </View>
      )}
    </SectionContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
    marginBottom: 4,
  },
  helperText: {
    ...Typography.caption,
    color: Colors.deepStone,
    marginBottom: 12,
    lineHeight: 18,
  },
  // Text area styles
  textArea: {
    ...Typography.body,
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    color: Colors.deepCharcoal,
    borderWidth: 1,
    borderColor: Colors.softAsh,
  },
  overallTextArea: {
    minHeight: 160,
  },
  charCount: {
    ...Typography.caption,
    color: Colors.mediumStone,
    textAlign: 'right',
    marginTop: 4,
  },
  // Emotional State Grid
  emotionalStateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  emotionalStateCard: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.warmPaper,
    borderWidth: 2,
    borderColor: Colors.softAsh,
    gap: 6,
    minHeight: 80,
    justifyContent: 'center',
  },
  emotionalStateCardActive: {
    backgroundColor: Colors.pureWhite,
    borderWidth: 2,
  },
  emotionalStateLabel: {
    ...Typography.caption,
    color: Colors.deepStone,
    textAlign: 'center',
    fontWeight: '500',
  },
  emotionalStateLabelActive: {
    color: Colors.deepCharcoal,
    fontWeight: '600',
  },
  // Resilience Options
  resilienceOptions: {
    gap: 8,
  },
  resilienceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.warmPaper,
    borderWidth: 2,
    borderColor: Colors.softAsh,
    gap: 12,
    minHeight: 64,
  },
  resilienceCardActive: {
    backgroundColor: Colors.saffronGold08,
    borderColor: Colors.saffronGold,
  },
  resilienceContent: {
    flex: 1,
  },
  resilienceLabel: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.deepCharcoal,
    marginBottom: 2,
  },
  resilienceLabelActive: {
    color: Colors.deepCharcoal,
  },
  resilienceDescription: {
    ...Typography.caption,
    color: Colors.deepStone,
  },
  // Encouragement box
  encouragementBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.lotusPink12,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.lotusPink,
  },
  encouragementText: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    flex: 1,
    lineHeight: 20,
  },
});

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MindIntentionResponse } from '../../../../types/simplifiedReflection';
import SectionContainer from '../../../common/SectionContainer';
import { Colors } from '../../../../constants/Colors';
import { Typography } from '../../../../constants/Typography';

interface MindIntentionSectionProps {
  data: MindIntentionResponse;
  onChange: (data: MindIntentionResponse) => void;
}

// Predefined seed options
const WHOLESOME_SEEDS = [
  'generosity',
  'patience',
  'mindfulness',
  'compassion',
  'joy',
  'contentment',
  'equanimity',
  'loving-kindness',
];

const UNWHOLESOME_SEEDS = [
  'anger',
  'jealousy',
  'craving',
  'aversion',
  'restlessness',
  'doubt',
  'pride',
  'delusion',
];

export default function MindIntentionSection({ data, onChange }: MindIntentionSectionProps) {
  const handleLordToggle = (lord: 'lordOfForm' | 'lordOfSpeech' | 'lordOfMind') => {
    onChange({
      ...data,
      lordsOfMaterialism: {
        ...data.lordsOfMaterialism,
        [lord]: !data.lordsOfMaterialism[lord],
      },
    });
  };

  const toggleWholesomeSeed = (seed: string) => {
    const updated = data.wholesomeSeeds.includes(seed)
      ? data.wholesomeSeeds.filter((s) => s !== seed)
      : [...data.wholesomeSeeds, seed];

    onChange({
      ...data,
      wholesomeSeeds: updated,
    });
  };

  const toggleUnwholesomeSeed = (seed: string) => {
    const updated = data.unwholesomeSeeds.includes(seed)
      ? data.unwholesomeSeeds.filter((s) => s !== seed)
      : [...data.unwholesomeSeeds, seed];

    onChange({
      ...data,
      unwholesomeSeeds: updated,
    });
  };

  return (
    <SectionContainer
      title="Mind & Intention"
      subtitle="Track your mental states, ego patterns, and which seeds you're cultivating."
      icon="brain-outline"
    >
      {/* Three Lords of Materialism */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>The Three Lords of Materialism</Text>
        <Text style={styles.helperText}>
          Which of these ego patterns appeared today?
        </Text>

        {/* Lord of Form */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleLordToggle('lordOfForm')}
          activeOpacity={0.7}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: data.lordsOfMaterialism.lordOfForm }}
        >
          <View style={styles.checkbox}>
            {data.lordsOfMaterialism.lordOfForm && (
              <Ionicons name="checkmark" size={20} color={Colors.saffronGold} />
            )}
          </View>
          <View style={styles.checkboxContent}>
            <Text style={styles.checkboxLabel}>Lord of Form</Text>
            <Text style={styles.checkboxDescription}>
              Seeking neurotic comfort or transcendental versions of comfort
            </Text>
          </View>
        </TouchableOpacity>

        {/* Lord of Speech */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleLordToggle('lordOfSpeech')}
          activeOpacity={0.7}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: data.lordsOfMaterialism.lordOfSpeech }}
        >
          <View style={styles.checkbox}>
            {data.lordsOfMaterialism.lordOfSpeech && (
              <Ionicons name="checkmark" size={20} color={Colors.saffronGold} />
            )}
          </View>
          <View style={styles.checkboxContent}>
            <Text style={styles.checkboxLabel}>Lord of Speech</Text>
            <Text style={styles.checkboxDescription}>
              Using intellect as a shield against reality
            </Text>
          </View>
        </TouchableOpacity>

        {/* Lord of Mind */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleLordToggle('lordOfMind')}
          activeOpacity={0.7}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: data.lordsOfMaterialism.lordOfMind }}
        >
          <View style={styles.checkbox}>
            {data.lordsOfMaterialism.lordOfMind && (
              <Ionicons name="checkmark" size={20} color={Colors.saffronGold} />
            )}
          </View>
          <View style={styles.checkboxContent}>
            <Text style={styles.checkboxLabel}>Lord of Mind</Text>
            <Text style={styles.checkboxDescription}>
              Using spirituality to feel special or superior
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Patterns Noticed (Merged Field) */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>What patterns did you notice today?</Text>
        <Text style={styles.helperText}>
          What rationalizations, self-deceptions, or fixed perceptions did you catch yourself in?
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={data.patternsNoticed}
          onChangeText={(text) => onChange({ ...data, patternsNoticed: text })}
          placeholder="Describe the patterns you noticed..."
          placeholderTextColor={Colors.mediumStone}
          maxLength={500}
        />
        <Text style={styles.charCount}>{data.patternsNoticed.length}/500</Text>
      </View>

      {/* Wholesome Seeds */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Wholesome Seeds Watered</Text>
        <Text style={styles.helperText}>
          Which positive mental states did you cultivate today?
        </Text>
        <View style={styles.chipContainer}>
          {WHOLESOME_SEEDS.map((seed) => {
            const isSelected = data.wholesomeSeeds.includes(seed);
            return (
              <TouchableOpacity
                key={seed}
                style={[
                  styles.chip,
                  isSelected && styles.chipWholesomeActive,
                ]}
                onPress={() => toggleWholesomeSeed(seed)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextActive,
                  ]}
                >
                  {seed}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Unwholesome Seeds */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Unwholesome Seeds Watered</Text>
        <Text style={styles.helperText}>
          Which negative mental states arose today?
        </Text>
        <View style={styles.chipContainer}>
          {UNWHOLESOME_SEEDS.map((seed) => {
            const isSelected = data.unwholesomeSeeds.includes(seed);
            return (
              <TouchableOpacity
                key={seed}
                style={[
                  styles.chip,
                  isSelected && styles.chipUnwholesomeActive,
                ]}
                onPress={() => toggleUnwholesomeSeed(seed)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextActive,
                  ]}
                >
                  {seed}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Pattern Response (Merged Field) */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>How did you work with these patterns?</Text>
        <Text style={styles.helperText}>
          When unwholesome patterns arose, how did you respond? Did you replace thoughts or practice mere recognition?
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={data.patternResponse}
          onChangeText={(text) => onChange({ ...data, patternResponse: text })}
          placeholder="Describe how you worked with the patterns..."
          placeholderTextColor={Colors.mediumStone}
          maxLength={400}
        />
        <Text style={styles.charCount}>{data.patternResponse.length}/400</Text>
      </View>
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
  // Checkbox styles
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    marginBottom: 8,
    minHeight: 64,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.saffronGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxLabel: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.deepCharcoal,
    marginBottom: 2,
  },
  checkboxDescription: {
    ...Typography.caption,
    color: Colors.deepStone,
    lineHeight: 16,
  },
  // Text area styles
  textArea: {
    ...Typography.body,
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    color: Colors.deepCharcoal,
    borderWidth: 1,
    borderColor: Colors.softAsh,
  },
  charCount: {
    ...Typography.caption,
    color: Colors.mediumStone,
    textAlign: 'right',
    marginTop: 4,
  },
  // Chip styles
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.warmPaper,
    borderWidth: 1.5,
    borderColor: Colors.softAsh,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipWholesomeActive: {
    backgroundColor: Colors.deepMoss,
    borderColor: Colors.deepMoss,
  },
  chipUnwholesomeActive: {
    backgroundColor: Colors.lotusPink,
    borderColor: Colors.lotusPink,
  },
  chipText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.deepStone,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: Colors.pureWhite,
    fontWeight: '600',
  },
});

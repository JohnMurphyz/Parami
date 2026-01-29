import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { GardenLogResponse } from '../types';
import SectionContainer from './SectionContainer';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface GardenLogSectionProps {
  data: GardenLogResponse;
  onChange: (data: GardenLogResponse) => void;
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

export default function GardenLogSection({ data, onChange }: GardenLogSectionProps) {
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
      title="The Garden Log"
      subtitle="What you water will grow. Track which mental seeds you cultivated today through selective watering."
      icon="leaf-outline"
    >
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
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={`Wholesome seed: ${seed}`}
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
          Which negative patterns did you notice feeding today?
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
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={`Unwholesome seed: ${seed}`}
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

      {/* Changing the Peg */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Changing the Peg</Text>
        <Text style={styles.helperText}>
          When a negative thought arose, did you consciously replace it with a wholesome one?
        </Text>
        <TextInput
          style={styles.textArea}
          value={data.changingThePeg}
          onChangeText={(text) => onChange({ ...data, changingThePeg: text })}
          placeholder="Example: 'When I felt anger at my colleague, I deliberately shifted to thinking about their positive qualities...'"
          placeholderTextColor={Colors.mediumStone}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          accessibilityLabel="Changing the Peg moments"
        />
      </View>

      {/* Hello, Habit Energy */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Hello, Habit Energy</Text>
        <Text style={styles.helperText}>
          When did you practice "mere recognition" - noticing a pattern without judgment or struggle?
        </Text>
        <TextInput
          style={styles.textArea}
          value={data.helloHabitEnergy}
          onChangeText={(text) => onChange({ ...data, helloHabitEnergy: text })}
          placeholder="Example: 'I noticed my habit of checking my phone when anxious. I just said hello to it without trying to fix it...'"
          placeholderTextColor={Colors.mediumStone}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          accessibilityLabel="Hello, Habit Energy recognitions"
        />
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.warmStone,
    borderWidth: 1.5,
    borderColor: Colors.softAsh,
  },
  chipWholesomeActive: {
    backgroundColor: Colors.deepMoss08,
    borderColor: Colors.deepMoss,
  },
  chipUnwholesomeActive: {
    backgroundColor: Colors.lotusPink12,
    borderColor: Colors.lotusPink,
  },
  chipText: {
    ...Typography.body,
    color: Colors.deepStone,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: Colors.deepCharcoal,
    fontWeight: '600',
  },
  textArea: {
    ...Typography.body,
    backgroundColor: Colors.pureWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.softAsh,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

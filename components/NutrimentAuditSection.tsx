import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NutrimentAuditResponse } from '../types';
import SectionContainer from './SectionContainer';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface NutrimentAuditSectionProps {
  data: NutrimentAuditResponse;
  onChange: (data: NutrimentAuditResponse) => void;
}

export default function NutrimentAuditSection({ data, onChange }: NutrimentAuditSectionProps) {
  const handleToxicMediaChange = (text: string) => {
    // Convert comma-separated string to array
    const items = text
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    onChange({
      ...data,
      senseImpressions: {
        ...data.senseImpressions,
        toxicMedia: items,
      },
    });
  };

  const handleIntentionSelect = (value: 'self' | 'others' | 'both') => {
    onChange({
      ...data,
      intention: {
        ...data.intention,
        selfOrOthers: value,
      },
    });
  };

  return (
    <SectionContainer
      title="The Nutriment Audit"
      subtitle="Your mental diet shapes your consciousness. The Buddha taught that we consume four types of nutriments daily."
      icon="nutrition-outline"
    >
      {/* 1. Edible Food - Mindful Eating */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>1. Edible Food - Mindful Consumption</Text>
        <Text style={styles.helperText}>
          The first nutriment is physical food. Was your eating mindful today?
        </Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleContent}>
            <Text style={styles.toggleLabel}>I ate mindfully today</Text>
            <Text style={styles.toggleDescription}>
              Aware of what, why, and how I was eating
            </Text>
          </View>
          <Switch
            value={data.edibleFood.wasMindful}
            onValueChange={(value) =>
              onChange({
                ...data,
                edibleFood: { ...data.edibleFood, wasMindful: value },
              })
            }
            trackColor={{ false: Colors.softAsh, true: Colors.saffronGold40 }}
            thumbColor={data.edibleFood.wasMindful ? Colors.saffronGold : Colors.pureWhite}
            accessibilityLabel="Mindful eating toggle"
          />
        </View>

        <TextInput
          style={styles.textArea}
          value={data.edibleFood.notes}
          onChangeText={(text) =>
            onChange({
              ...data,
              edibleFood: { ...data.edibleFood, notes: text },
            })
          }
          placeholder="Notes on your relationship with food today..."
          placeholderTextColor={Colors.mediumStone}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          accessibilityLabel="Edible food notes"
        />
      </View>

      {/* 2. Sense Impressions - Mental Consumption */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>2. Sense Impressions - What You Consumed</Text>
        <Text style={styles.helperText}>
          The second nutriment is what enters through your senses. What toxic content did you consume?
        </Text>

        <TextInput
          style={styles.textInput}
          value={data.senseImpressions.toxicMedia.join(', ')}
          onChangeText={handleToxicMediaChange}
          placeholder="e.g., doom-scrolling news, violent content, toxic social media"
          placeholderTextColor={Colors.mediumStone}
          accessibilityLabel="Toxic media consumed"
        />

        <Text style={[styles.helperText, { marginTop: 8 }]}>
          How did this content affect you?
        </Text>

        <TextInput
          style={styles.textArea}
          value={data.senseImpressions.impact}
          onChangeText={(text) =>
            onChange({
              ...data,
              senseImpressions: { ...data.senseImpressions, impact: text },
            })
          }
          placeholder="Example: 'Made me anxious and reactive, harder to concentrate...'"
          placeholderTextColor={Colors.mediumStone}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          accessibilityLabel="Impact of toxic media"
        />
      </View>

      {/* 3. Intention (Volition) - Deep Driving Desire */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>3. Intention - What Drove You Today</Text>
        <Text style={styles.helperText}>
          The third nutriment is your deepest intention. What was your underlying motivation?
        </Text>

        <TextInput
          style={styles.textArea}
          value={data.intention.deepDesire}
          onChangeText={(text) =>
            onChange({
              ...data,
              intention: { ...data.intention, deepDesire: text },
            })
          }
          placeholder="Example: 'I wanted to prove myself,' or 'I genuinely wanted to help others...'"
          placeholderTextColor={Colors.mediumStone}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          accessibilityLabel="Deep driving desire"
        />

        <Text style={[styles.helperText, { marginTop: 12 }]}>
          Was this motivation primarily for...
        </Text>

        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => handleIntentionSelect('self')}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityState={{ checked: data.intention.selfOrOthers === 'self' }}
          >
            <View style={styles.radio}>
              {data.intention.selfOrOthers === 'self' && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={styles.radioLabel}>Self-gain (security, pleasure, recognition)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => handleIntentionSelect('others')}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityState={{ checked: data.intention.selfOrOthers === 'others' }}
          >
            <View style={styles.radio}>
              {data.intention.selfOrOthers === 'others' && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={styles.radioLabel}>Welfare of others (genuine service)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => handleIntentionSelect('both')}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityState={{ checked: data.intention.selfOrOthers === 'both' }}
          >
            <View style={styles.radio}>
              {data.intention.selfOrOthers === 'both' && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={styles.radioLabel}>Both (interconnected benefit)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Consciousness - Collective Energy */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>4. Consciousness - Collective Energy</Text>
        <Text style={styles.helperText}>
          The fourth nutriment is the consciousness you share with others. What collective energies influenced you?
        </Text>

        <TextInput
          style={styles.textArea}
          value={data.collectiveEnergy}
          onChangeText={(text) => onChange({ ...data, collectiveEnergy: text })}
          placeholder="Example: 'My family's anxiety about money,' or 'My team's enthusiasm for the project...'"
          placeholderTextColor={Colors.mediumStone}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          accessibilityLabel="Collective energy influences"
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
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warmStone,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  toggleContent: {
    flex: 1,
    gap: 4,
  },
  toggleLabel: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.deepCharcoal,
  },
  toggleDescription: {
    ...Typography.caption,
    color: Colors.deepStone,
    lineHeight: 18,
  },
  textInput: {
    ...Typography.body,
    backgroundColor: Colors.pureWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.softAsh,
    padding: 16,
    minHeight: 50,
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
  radioGroup: {
    gap: 12,
    marginTop: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warmStone,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.saffronGold,
    backgroundColor: Colors.pureWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.saffronGold,
  },
  radioLabel: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    flex: 1,
  },
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { VicissitudesResponse } from '../../../../types';
import SectionContainer from '../../../common/SectionContainer';
import { Colors } from '../../../../constants/Colors';
import { Typography } from '../../../../constants/Typography';

interface VicissitudesSectionProps {
  data: VicissitudesResponse;
  onChange: (data: VicissitudesResponse) => void;
}

type WorldlyCondition = 'gain' | 'loss' | 'fame' | 'disrepute' | 'praise' | 'blame' | 'pleasure' | 'pain';

interface ConditionConfig {
  key: WorldlyCondition;
  label: string;
  description: string;
}

const WORLDLY_CONDITIONS: ConditionConfig[] = [
  { key: 'gain', label: 'Gain', description: 'Material or emotional acquisition' },
  { key: 'loss', label: 'Loss', description: 'Material or emotional deprivation' },
  { key: 'fame', label: 'Fame', description: 'Recognition or status increase' },
  { key: 'disrepute', label: 'Disrepute', description: 'Loss of reputation or respect' },
  { key: 'praise', label: 'Praise', description: 'Receiving compliments or approval' },
  { key: 'blame', label: 'Blame', description: 'Receiving criticism or disapproval' },
  { key: 'pleasure', label: 'Pleasure', description: 'Sensory or emotional satisfaction' },
  { key: 'pain', label: 'Pain', description: 'Physical or emotional discomfort' },
];

export default function VicissitudesSection({ data, onChange }: VicissitudesSectionProps) {
  const [expandedCards, setExpandedCards] = useState<Set<WorldlyCondition>>(new Set());

  const toggleCard = (condition: WorldlyCondition) => {
    // Configure smooth animation
    LayoutAnimation.configureNext({
      duration: 250,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(condition)) {
      newExpanded.delete(condition);
    } else {
      newExpanded.add(condition);
    }
    setExpandedCards(newExpanded);
  };

  const handleConditionToggle = (condition: WorldlyCondition, occurred: boolean) => {
    onChange({
      ...data,
      worldlyConditions: {
        ...data.worldlyConditions,
        [condition]: occurred
          ? { occurred: true, reaction: data.worldlyConditions[condition]?.reaction || '' }
          : undefined,
      },
    });

    // Auto-expand when toggled on
    if (occurred && !expandedCards.has(condition)) {
      LayoutAnimation.configureNext({
        duration: 250,
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
      });
      setExpandedCards(new Set([...expandedCards, condition]));
    }
  };

  const handleReactionChange = (condition: WorldlyCondition, reaction: string) => {
    const existing = data.worldlyConditions[condition];
    if (existing) {
      onChange({
        ...data,
        worldlyConditions: {
          ...data.worldlyConditions,
          [condition]: { ...existing, reaction },
        },
      });
    }
  };

  return (
    <SectionContainer
      title="The Vicissitudes of Life"
      subtitle="The Buddha taught there are 8 worldly conditions that constantly change. Track which you encountered and how you responded."
      icon="swap-horizontal-outline"
    >
      {/* The 8 Worldly Conditions */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>The 8 Worldly Conditions</Text>
        <Text style={styles.helperText}>
          Which of these pairs appeared in your life today? How did you respond?
        </Text>

        {WORLDLY_CONDITIONS.map((condition) => {
          const conditionData = data.worldlyConditions[condition.key];
          const isActive = conditionData?.occurred || false;
          const isExpanded = expandedCards.has(condition.key);

          return (
            <View key={condition.key} style={styles.conditionCard}>
              {/* Card Header */}
              <TouchableOpacity
                style={[
                  styles.conditionHeader,
                  isActive && styles.conditionHeaderActive,
                ]}
                onPress={() => toggleCard(condition.key)}
                activeOpacity={0.7}
              >
                <View style={styles.conditionHeaderContent}>
                  <Text style={[styles.conditionLabel, isActive && styles.conditionLabelActive]}>
                    {condition.label}
                  </Text>
                  <Text style={styles.conditionDescription}>{condition.description}</Text>
                </View>

                <View style={styles.conditionHeaderActions}>
                  <Switch
                    value={isActive}
                    onValueChange={(value) => handleConditionToggle(condition.key, value)}
                    trackColor={{ false: Colors.softAsh, true: Colors.saffronGold40 }}
                    thumbColor={isActive ? Colors.saffronGold : Colors.pureWhite}
                    accessibilityLabel={`${condition.label} occurred toggle`}
                  />
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={Colors.deepStone}
                  />
                </View>
              </TouchableOpacity>

              {/* Expandable Content */}
              {isExpanded && isActive && (
                <View style={styles.conditionContent}>
                  <Text style={styles.conditionPrompt}>How did you respond?</Text>
                  <TextInput
                    style={styles.textArea}
                    value={conditionData?.reaction || ''}
                    onChangeText={(text) => handleReactionChange(condition.key, text)}
                    placeholder={`Example: "I noticed ${condition.label.toLowerCase()} and felt...", "I responded by..."`}
                    placeholderTextColor={Colors.mediumStone}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    accessibilityLabel={`${condition.label} reaction`}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* The Second Arrow */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>The Second Arrow</Text>
        <Text style={styles.helperText}>
          The Buddha taught that when hit by an arrow (physical/emotional pain), we often shoot a second arrow (mental suffering) into ourselves. Did this happen today?
        </Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleContent}>
            <Text style={styles.toggleLabel}>I added a "second arrow" today</Text>
            <Text style={styles.toggleDescription}>
              I added mental suffering to physical/emotional pain
            </Text>
          </View>
          <Switch
            value={data.secondArrow.occurred}
            onValueChange={(value) =>
              onChange({
                ...data,
                secondArrow: { ...data.secondArrow, occurred: value },
              })
            }
            trackColor={{ false: Colors.softAsh, true: Colors.lotusPink40 }}
            thumbColor={data.secondArrow.occurred ? Colors.lotusPink : Colors.pureWhite}
            accessibilityLabel="Second arrow occurred toggle"
          />
        </View>

        {data.secondArrow.occurred && (
          <>
            <Text style={[styles.helperText, { marginTop: 12 }]}>
              Describe the second arrow you added:
            </Text>
            <TextInput
              style={styles.textArea}
              value={data.secondArrow.description}
              onChangeText={(text) =>
                onChange({
                  ...data,
                  secondArrow: { ...data.secondArrow, description: text },
                })
              }
              placeholder="Example: 'My back hurt (first arrow), then I got angry at myself for not exercising enough and felt like a failure (second arrow)...'"
              placeholderTextColor={Colors.mediumStone}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              accessibilityLabel="Second arrow description"
            />
          </>
        )}
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
  conditionCard: {
    backgroundColor: Colors.warmStone,
    borderRadius: 12,
    overflow: 'hidden',
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  conditionHeaderActive: {
    backgroundColor: Colors.saffronGold08,
  },
  conditionHeaderContent: {
    flex: 1,
    gap: 2,
  },
  conditionLabel: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.deepStone,
  },
  conditionLabelActive: {
    color: Colors.deepCharcoal,
  },
  conditionDescription: {
    ...Typography.caption,
    color: Colors.mediumStone,
    fontSize: 12,
  },
  conditionHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  conditionContent: {
    padding: 14,
    paddingTop: 0,
    gap: 8,
  },
  conditionPrompt: {
    ...Typography.caption,
    color: Colors.deepStone,
    fontWeight: '600',
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

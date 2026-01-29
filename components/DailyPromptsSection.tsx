import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { StructuredReflection } from '../types';
import SectionContainer from './SectionContainer';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface DailyPromptsSectionProps {
  data: StructuredReflection['dailyPrompts'];
  onChange: (data: StructuredReflection['dailyPrompts']) => void;
}

interface PromptConfig {
  key: keyof StructuredReflection['dailyPrompts'];
  question: string;
  teaching: string;
  placeholder: string;
}

const DAILY_PROMPTS: PromptConfig[] = [
  {
    key: 'selfReliance',
    question: 'Did I act as my own master today?',
    teaching: 'Self-Reliance',
    placeholder:
      'Example: "I made decisions based on my own understanding rather than seeking constant validation. I trusted my practice..."',
  },
  {
    key: 'nowness',
    question: 'How many times did I stop the horse and be present?',
    teaching: 'Nowness',
    placeholder:
      'Example: "When I caught myself rushing through lunch, I stopped and actually tasted my food. When planning tomorrow, I came back to now..."',
  },
  {
    key: 'nonAttachment',
    question: 'Which of my cows did I release today?',
    teaching: 'Non-Attachment',
    placeholder:
      'Example: "I let go of needing my coworker to respond immediately. I released my attachment to having the perfect meditation session..."',
  },
  {
    key: 'clarity',
    question: 'Did I look at my mind like a mirror today?',
    teaching: 'Clarity',
    placeholder:
      'Example: "I observed my anxiety without adding commentary. I noticed thoughts arising and passing like reflections in a mirror..."',
  },
];

export default function DailyPromptsSection({ data, onChange }: DailyPromptsSectionProps) {
  const handleChange = (key: keyof StructuredReflection['dailyPrompts'], value: string) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  return (
    <SectionContainer
      title="Daily Contemplations"
      subtitle="These four questions remain constant, allowing you to track patterns and growth over time."
      icon="calendar-outline"
    >
      {DAILY_PROMPTS.map((prompt, index) => (
        <View key={prompt.key} style={styles.promptSection}>
          {/* Prompt Header */}
          <View style={styles.promptHeader}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>{index + 1}</Text>
            </View>
            <View style={styles.promptHeaderContent}>
              <Text style={styles.promptTeaching}>{prompt.teaching}</Text>
              <Text style={styles.promptQuestion}>{prompt.question}</Text>
            </View>
          </View>

          {/* Prompt Input */}
          <TextInput
            style={styles.textArea}
            value={data[prompt.key]}
            onChangeText={(text) => handleChange(prompt.key, text)}
            placeholder={prompt.placeholder}
            placeholderTextColor={Colors.mediumStone}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            accessibilityLabel={`${prompt.teaching} reflection`}
          />
        </View>
      ))}

      {/* Teaching Note */}
      <View style={styles.teachingNote}>
        <Text style={styles.teachingNoteTitle}>About These Contemplations</Text>
        <Text style={styles.teachingNoteText}>
          <Text style={styles.teachingNoteBold}>Self-Reliance:</Text> The Buddha's final words were "Be a lamp unto yourself." Act as your own master, not dependent on constant external guidance.
        </Text>
        <Text style={styles.teachingNoteText}>
          <Text style={styles.teachingNoteBold}>Nowness:</Text> The teaching to "stop the horse" means interrupting the constant forward momentum of planning, achieving, and becoming.
        </Text>
        <Text style={styles.teachingNoteText}>
          <Text style={styles.teachingNoteBold}>Non-Attachment:</Text> The story of releasing cows teaches that we suffer by holding onto things that want to be free.
        </Text>
        <Text style={styles.teachingNoteText}>
          <Text style={styles.teachingNoteBold}>Clarity:</Text> Mirror-mind reflects reality without distortion, judgment, or preference.
        </Text>
      </View>
    </SectionContainer>
  );
}

const styles = StyleSheet.create({
  promptSection: {
    gap: 12,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.saffronGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: {
    ...Typography.body,
    color: Colors.pureWhite,
    fontWeight: '700',
    fontSize: 16,
  },
  promptHeaderContent: {
    flex: 1,
    gap: 4,
  },
  promptTeaching: {
    ...Typography.caption,
    color: Colors.saffronGold,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  promptQuestion: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
    lineHeight: 24,
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
  teachingNote: {
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 20,
    gap: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.softAsh,
  },
  teachingNoteTitle: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
    marginBottom: 4,
  },
  teachingNoteText: {
    ...Typography.caption,
    color: Colors.deepStone,
    lineHeight: 20,
  },
  teachingNoteBold: {
    fontWeight: '700',
    color: Colors.deepCharcoal,
  },
});

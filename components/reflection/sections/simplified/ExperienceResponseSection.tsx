import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExperienceResponseData, LifeExperience } from '../../../../types/simplifiedReflection';
import SectionContainer from '../../../common/SectionContainer';
import { Colors } from '../../../../constants/Colors';
import { Typography } from '../../../../constants/Typography';

interface ExperienceResponseSectionProps {
  data: ExperienceResponseData;
  onChange: (data: ExperienceResponseData) => void;
}

interface ExperienceConfig {
  key: LifeExperience;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const LIFE_EXPERIENCES: ExperienceConfig[] = [
  {
    key: 'gain-loss',
    label: 'Gain / Loss',
    description: 'Material or emotional acquisition/deprivation',
    icon: 'swap-horizontal-outline'
  },
  {
    key: 'praise-blame',
    label: 'Praise / Blame',
    description: 'Receiving approval or criticism',
    icon: 'chatbox-ellipses-outline'
  },
  {
    key: 'pleasure-pain',
    label: 'Pleasure / Pain',
    description: 'Sensory or emotional satisfaction/discomfort',
    icon: 'happy-outline'
  },
  {
    key: 'success-failure',
    label: 'Success / Failure',
    description: 'Achievement or setback in endeavors',
    icon: 'trophy-outline'
  },
];

export default function ExperienceResponseSection({
  data,
  onChange
}: ExperienceResponseSectionProps) {

  const toggleLifeExperience = (experience: LifeExperience) => {
    const updated = data.lifeExperiences.selected.includes(experience)
      ? data.lifeExperiences.selected.filter((e) => e !== experience)
      : [...data.lifeExperiences.selected, experience];

    onChange({
      ...data,
      lifeExperiences: {
        ...data.lifeExperiences,
        selected: updated,
      },
    });
  };

  const handleSecondArrowToggle = (occurred: boolean) => {
    onChange({
      ...data,
      secondArrow: {
        ...data.secondArrow,
        occurred,
      },
    });
  };

  return (
    <SectionContainer
      title="Experience & Response"
      subtitle="Track life experiences and how you responded to them."
      icon="compass-outline"
    >
      {/* Life Experiences */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Which life experiences stood out today?</Text>
        <Text style={styles.helperText}>
          Select the worldly conditions you encountered
        </Text>
        <View style={styles.chipContainer}>
          {LIFE_EXPERIENCES.map((experience) => {
            const isSelected = data.lifeExperiences.selected.includes(experience.key);
            return (
              <TouchableOpacity
                key={experience.key}
                style={[
                  styles.experienceChip,
                  isSelected && styles.experienceChipActive,
                ]}
                onPress={() => toggleLifeExperience(experience.key)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Ionicons
                  name={experience.icon}
                  size={20}
                  color={isSelected ? Colors.pureWhite : Colors.deepStone}
                />
                <Text
                  style={[
                    styles.experienceChipText,
                    isSelected && styles.experienceChipTextActive,
                  ]}
                >
                  {experience.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Optional description if any selected */}
        {data.lifeExperiences.selected.length > 0 && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>
              Briefly describe what happened and how you responded
            </Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={3}
              value={data.lifeExperiences.description}
              onChangeText={(text) => onChange({
                ...data,
                lifeExperiences: {
                  ...data.lifeExperiences,
                  description: text,
                },
              })}
              placeholder="What happened and how did you respond?"
              placeholderTextColor={Colors.mediumStone}
              maxLength={300}
            />
            <Text style={styles.charCount}>
              {data.lifeExperiences.description.length}/300
            </Text>
          </View>
        )}
      </View>

      {/* Second Arrow */}
      <View style={styles.section}>
        <View style={styles.secondArrowHeader}>
          <View style={styles.secondArrowTitleRow}>
            <Ionicons name="arrow-forward-outline" size={20} color={Colors.lotusPink} />
            <Text style={styles.sectionLabel}>The Second Arrow</Text>
          </View>
          <Switch
            value={data.secondArrow.occurred}
            onValueChange={handleSecondArrowToggle}
            trackColor={{
              false: Colors.softAsh,
              true: Colors.lotusPink
            }}
            thumbColor={Colors.pureWhite}
            ios_backgroundColor={Colors.softAsh}
          />
        </View>
        <Text style={styles.helperText}>
          Did you add mental grief to physical/emotional pain today?
        </Text>

        {data.secondArrow.occurred && (
          <View style={styles.secondArrowContent}>
            <Text style={styles.secondArrowPrompt}>
              Describe the second arrow you added
            </Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={3}
              value={data.secondArrow.description}
              onChangeText={(text) => onChange({
                ...data,
                secondArrow: {
                  ...data.secondArrow,
                  description: text,
                },
              })}
              placeholder="What mental story, blame, or resistance did you add?"
              placeholderTextColor={Colors.mediumStone}
              maxLength={300}
            />
            <Text style={styles.charCount}>
              {data.secondArrow.description.length}/300
            </Text>
          </View>
        )}
      </View>

      {/* Hard Ground Reflection */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Where did you land on hard ground today?</Text>
        <Text style={styles.helperText}>
          When did you accept disappointing reality without seeking comfort? When did you resist?
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={data.hardGroundReflection}
          onChangeText={(text) => onChange({ ...data, hardGroundReflection: text })}
          placeholder="Describe moments of acceptance or resistance..."
          placeholderTextColor={Colors.mediumStone}
          maxLength={400}
        />
        <Text style={styles.charCount}>{data.hardGroundReflection.length}/400</Text>
      </View>

      {/* Mental Consumption */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>What did you consume that affected your mind?</Text>
        <Text style={styles.helperText}>
          Media, conversations, or environments that impacted your mental state
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          value={data.mentalConsumption}
          onChangeText={(text) => onChange({ ...data, mentalConsumption: text })}
          placeholder="List media, conversations, or environments..."
          placeholderTextColor={Colors.mediumStone}
          maxLength={200}
        />
        <Text style={styles.charCount}>{data.mentalConsumption.length}/200</Text>
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
  // Experience chips
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  experienceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.warmPaper,
    borderWidth: 1.5,
    borderColor: Colors.softAsh,
    minHeight: 44,
  },
  experienceChipActive: {
    backgroundColor: Colors.saffronGold,
    borderColor: Colors.saffronGold,
  },
  experienceChipText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.deepStone,
    fontWeight: '500',
  },
  experienceChipTextActive: {
    color: Colors.pureWhite,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionLabel: {
    ...Typography.caption,
    color: Colors.deepStone,
    marginBottom: 8,
  },
  // Second Arrow styles
  secondArrowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  secondArrowTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secondArrowContent: {
    marginTop: 12,
  },
  secondArrowPrompt: {
    ...Typography.caption,
    color: Colors.deepStone,
    marginBottom: 8,
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
  charCount: {
    ...Typography.caption,
    color: Colors.mediumStone,
    textAlign: 'right',
    marginTop: 4,
  },
});

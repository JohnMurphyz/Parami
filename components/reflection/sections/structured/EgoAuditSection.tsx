import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EgoAuditResponse } from '../../../../types';
import SectionContainer from '../../../common/SectionContainer';
import { Colors } from '../../../../constants/Colors';
import { Typography } from '../../../../constants/Typography';

interface EgoAuditSectionProps {
  data: EgoAuditResponse;
  onChange: (data: EgoAuditResponse) => void;
}

export default function EgoAuditSection({ data, onChange }: EgoAuditSectionProps) {
  const handleLordToggle = (lord: 'lordOfForm' | 'lordOfSpeech' | 'lordOfMind') => {
    onChange({
      ...data,
      lordsOfMaterialism: {
        ...data.lordsOfMaterialism,
        [lord]: !data.lordsOfMaterialism[lord],
      },
    });
  };

  const handleNotesChange = (notes: string) => {
    onChange({
      ...data,
      lordsOfMaterialism: {
        ...data.lordsOfMaterialism,
        notes,
      },
    });
  };

  return (
    <SectionContainer
      title="The Ego Audit"
      subtitle="Genuine reflection must include an honest assessment of how the ego is attempting to hijack your progress."
      icon="eye-outline"
    >
      {/* Three Lords of Materialism */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>The Three Lords of Materialism</Text>
        <Text style={styles.helperText}>
          Which of these patterns appeared today?
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
              Using spiritual techniques to feel special or superior
            </Text>
          </View>
        </TouchableOpacity>

        {/* Notes on Lords */}
        <TextInput
          style={styles.textArea}
          value={data.lordsOfMaterialism.notes}
          onChangeText={handleNotesChange}
          placeholder="Additional notes on how these patterns manifested..."
          placeholderTextColor={Colors.mediumStone}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          accessibilityLabel="Notes on Lords of Materialism"
        />
      </View>

      {/* Spiritual Advisor */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>The Spiritual Advisor</Text>
        <Text style={styles.helperText}>
          What rationalizations did you catch yourself making today to maintain comfort?
        </Text>
        <TextInput
          style={styles.textArea}
          value={data.spiritualAdvisor}
          onChangeText={(text) => onChange({ ...data, spiritualAdvisor: text })}
          placeholder="Example: 'I told myself I was too tired to meditate, but really I was avoiding discomfort...'"
          placeholderTextColor={Colors.mediumStone}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          accessibilityLabel="Spiritual Advisor rationalizations"
        />
      </View>

      {/* Are You Sure? */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>"Are You Sure?"</Text>
        <Text style={styles.helperText}>
          What perceptions did you challenge today? Describe a moment you questioned your version of reality.
        </Text>
        <TextInput
          style={styles.textArea}
          value={data.areYouSure}
          onChangeText={(text) => onChange({ ...data, areYouSure: text })}
          placeholder="Example: 'I thought my colleague was being dismissive, but when I checked, maybe I was projecting...'"
          placeholderTextColor={Colors.mediumStone}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          accessibilityLabel="Perception challenges"
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.warmStone,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.saffronGold,
    backgroundColor: Colors.pureWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContent: {
    flex: 1,
    gap: 4,
  },
  checkboxLabel: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.deepCharcoal,
  },
  checkboxDescription: {
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

import React from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { DisappointmentResponse } from '../types';
import SectionContainer from './SectionContainer';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface DisappointmentSectionProps {
  data: DisappointmentResponse;
  onChange: (data: DisappointmentResponse) => void;
}

export default function DisappointmentSection({ data, onChange }: DisappointmentSectionProps) {
  return (
    <SectionContainer
      title="The Chariot of Disappointment"
      subtitle="Chögyam Trungpa taught that disappointment is a useful message. It tells us when we're seeking comfort instead of reality."
      icon="trending-down-outline"
    >
      {/* Practice Felt Tedious */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>The Tedious Path</Text>
        <Text style={styles.helperText}>
          Authentic practice often feels mundane and unrewarding. Did you experience this today?
        </Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleContent}>
            <Text style={styles.toggleLabel}>My practice felt tedious today</Text>
            <Text style={styles.toggleDescription}>
              It wasn't exciting, transformative, or special
            </Text>
          </View>
          <Switch
            value={data.practiceFeltTedious}
            onValueChange={(value) =>
              onChange({ ...data, practiceFeltTedious: value })
            }
            trackColor={{ false: Colors.softAsh, true: Colors.saffronGold40 }}
            thumbColor={data.practiceFeltTedious ? Colors.saffronGold : Colors.pureWhite}
            accessibilityLabel="Practice felt tedious toggle"
          />
        </View>
      </View>

      {/* Landing on Hard Ground */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Landing on Hard Ground</Text>
        <Text style={styles.helperText}>
          When did you accept disappointing reality without seeking comfort? Where did you land on hard ground and stay there?
        </Text>

        <TextInput
          style={styles.textArea}
          value={data.hardGroundMoments}
          onChangeText={(text) => onChange({ ...data, hardGroundMoments: text })}
          placeholder="Example: 'I realized my meditation isn't making me calmer, and I stopped trying to force it to. I just sat with the discomfort of ordinariness...'"
          placeholderTextColor={Colors.mediumStone}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          accessibilityLabel="Hard ground moments"
        />

        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            "Disappointment is the best chariot to use on the path of dharma."
          </Text>
          <Text style={styles.quoteAuthor}>— Chögyam Trungpa Rinpoche</Text>
        </View>
      </View>

      {/* Seeking Soft Landing */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Seeking a Soft Landing</Text>
        <Text style={styles.helperText}>
          When did you seek spiritual comfort or fantasy to avoid disappointment? When did you try to avoid the hard ground?
        </Text>

        <TextInput
          style={styles.textArea}
          value={data.softLandingAttempts}
          onChangeText={(text) => onChange({ ...data, softLandingAttempts: text })}
          placeholder="Example: 'When practice felt boring, I fantasized about having a breakthrough experience. I looked for a more exciting technique instead of staying present...'"
          placeholderTextColor={Colors.mediumStone}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          accessibilityLabel="Soft landing attempts"
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            <Text style={styles.infoBold}>Soft Landing:</Text> Seeking spiritual highs, dramatic insights, or transcendent experiences to avoid the groundedness of ordinary reality.
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoBold}>Hard Ground:</Text> Accepting that genuine practice is often boring, repetitive, and doesn't make you feel special.
          </Text>
        </View>
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
  quoteBox: {
    backgroundColor: Colors.saffronGold08,
    borderLeftWidth: 3,
    borderLeftColor: Colors.saffronGold,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  quoteText: {
    ...Typography.body,
    fontStyle: 'italic',
    color: Colors.deepCharcoal,
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    ...Typography.caption,
    color: Colors.deepStone,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: Colors.deepCharcoal02,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.deepStone,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '700',
    color: Colors.deepCharcoal,
  },
});

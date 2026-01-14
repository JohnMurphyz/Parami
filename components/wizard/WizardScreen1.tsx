import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Parami } from '../../types';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import ParamiHeroCard from '../ParamiHeroCard';

interface WizardScreen1Props {
  parami: Parami;
  currentIndex: number;
  totalCount: number;
  isActive: boolean;
}

export default function WizardScreen1({
  parami,
  currentIndex,
  totalCount,
}: WizardScreen1Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Today's Teaching</Text>
      </View>

      {/* Hero Card */}
      <ParamiHeroCard
        paramiId={parami.id}
        paramiName={parami.name}
        englishName={parami.englishName}
        shortDescription={parami.shortDescription}
        fullDescription={parami.fullDescription}
        currentIndex={currentIndex}
        totalCount={totalCount}
      />

      {/* Understanding Section */}
      <View style={styles.understandingSection}>
        <Text style={styles.sectionLabel}>Understanding</Text>
        <Text style={styles.descriptionText}>{parami.fullDescription}</Text>
      </View>

      {/* Swipe Hint */}
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>Swipe to continue →</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmStone,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 24,
    alignItems: 'center',
  },
  welcomeText: {
    ...Typography.h3,
    color: Colors.saffronGold,
  },
  understandingSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionLabel: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
    marginBottom: 16,
  },
  descriptionText: {
    ...Typography.bodyLarge,
    color: Colors.deepStone,
  },
  hintContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  hintText: {
    ...Typography.caption,
    color: Colors.mediumStone,
    fontStyle: 'italic',
  },
});

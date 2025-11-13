import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Parami } from '../../types';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

interface WizardScreen2Props {
  parami: Parami;
  isActive: boolean;
}

export default function WizardScreen2({ parami }: WizardScreen2Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Wisdom & Story</Text>
      </View>

      {/* Quote Section */}
      <View style={styles.quoteSection}>
        <Text style={styles.quoteText}>"{parami.quote.text}"</Text>
        <Text style={styles.quoteAuthor}>— {parami.quote.author}</Text>
        {parami.quote.source && (
          <Text style={styles.quoteSource}>{parami.quote.source}</Text>
        )}
      </View>

      {/* Story Section */}
      <View style={styles.storySection}>
        <Text style={styles.sectionLabel}>A Teaching Story</Text>
        <Text style={styles.storyText}>{parami.story}</Text>
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
    paddingBottom: 32,
    alignItems: 'center',
  },
  headerText: {
    ...Typography.h3,
    color: Colors.saffronGold,
  },
  quoteSection: {
    backgroundColor: Colors.lotusPink12,
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lotusPink40,
    marginBottom: 32,
  },
  quoteText: {
    ...Typography.quote,
    color: Colors.deepCharcoal,
    marginBottom: 16,
  },
  quoteAuthor: {
    ...Typography.body,
    color: Colors.deepStone,
    fontWeight: '600',
  },
  quoteSource: {
    ...Typography.caption,
    color: Colors.mediumStone,
    marginTop: 4,
  },
  storySection: {
    paddingHorizontal: 24,
  },
  sectionLabel: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
    marginBottom: 16,
  },
  storyText: {
    ...Typography.bodyLarge,
    color: Colors.deepStone,
    lineHeight: 28,
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

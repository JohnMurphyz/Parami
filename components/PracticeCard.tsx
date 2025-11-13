import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Practice } from '../types';

interface PracticeCardProps {
  practice: Practice;
  number: number;
}

export default function PracticeCard({ practice, number }: PracticeCardProps) {
  const difficultyColors = {
    easy: Colors.deepMoss,
    medium: Colors.saffronGold,
    challenging: Colors.burntSienna,
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{number}</Text>
        </View>
        <View style={styles.metadataContainer}>
          <Text style={[styles.difficulty, { color: difficultyColors[practice.difficulty] }]}>
            {practice.difficulty.charAt(0).toUpperCase() + practice.difficulty.slice(1)}
          </Text>
          <Text style={styles.context}>• {practice.context}</Text>
        </View>
      </View>
      <Text style={styles.title}>{practice.title}</Text>
      <Text style={styles.description}>{practice.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.saffronGold,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.saffronGold08,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    ...Typography.h2,
    color: Colors.saffronGold,
    fontWeight: '700',
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  difficulty: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  context: {
    ...Typography.caption,
    color: Colors.mediumStone,
    marginLeft: 4,
  },
  title: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginBottom: 8,
  },
  description: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 22,
  },
});

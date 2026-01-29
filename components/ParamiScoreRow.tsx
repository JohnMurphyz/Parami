import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ParamiScore } from '../types';
import { getParamiById } from '../services/firebaseContentService';
import { getScoreCategory } from '../utils/quizScoring';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import ParamiIcon from './ParamiIcon';

interface ParamiScoreRowProps {
  score: ParamiScore;
  rank: number; // 1-10
  onPress?: () => void;
}

export default function ParamiScoreRow({ score, rank, onPress }: ParamiScoreRowProps) {
  const parami = getParamiById(score.paramiId);
  if (!parami) return null;

  const category = getScoreCategory(score.normalizedScore);

  // Get color based on score category
  const getScoreColor = () => {
    switch (category) {
      case 'strong':
        return Colors.deepMoss;
      case 'moderate':
        return Colors.saffronGold;
      case 'developing':
        return Colors.lotusPink;
    }
  };

  const scoreColor = getScoreColor();

  const content = (
    <View style={styles.container}>
      {/* Parami Image and Name */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <ParamiIcon paramiId={score.paramiId} size={40} />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.paramiName}>
            {parami.name} — {parami.englishName}
          </Text>
        </View>
        <Text style={[styles.scoreText, { color: scoreColor }]}>
          {score.normalizedScore}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${score.normalizedScore}%`,
                backgroundColor: scoreColor,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityLabel={`${parami.englishName} scored ${score.normalizedScore} out of 100`}
        accessibilityRole="button"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    flex: 1,
  },
  paramiName: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    fontWeight: '600',
  },
  scoreText: {
    ...Typography.h2,
    fontSize: 24,
    fontWeight: '700',
  },
  progressBarContainer: {
    paddingLeft: 52, // Align with name (icon width + gap)
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.softAsh,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

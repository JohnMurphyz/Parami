import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Practice } from '../types';

interface PracticeCardProps {
  practice: Practice;
  number: number;
  isChecked?: boolean;
  onToggle?: () => void;
  onShuffle?: () => void;
  canShuffle?: boolean;
}

const PracticeCard = React.memo(({ practice, number, isChecked = false, onToggle, onShuffle, canShuffle = true }: PracticeCardProps) => {
  const difficultyColors = {
    easy: Colors.deepMoss,
    medium: Colors.saffronGold,
    challenging: Colors.burntSienna,
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isChecked && styles.cardChecked
      ]}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityLabel={isChecked ? `${practice.title} - Completed` : practice.title}
      accessibilityHint={isChecked ? "Double tap to uncheck this practice" : "Double tap to mark this practice as completed"}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <View style={[styles.numberBadge, isChecked && styles.numberBadgeChecked]}>
          {isChecked ? (
            <Ionicons name="checkmark-circle" size={40} color={Colors.saffronGold} />
          ) : (
            <Text style={styles.numberText}>{number}</Text>
          )}
        </View>
        <View style={styles.metadataContainer}>
          <Text style={[styles.difficulty, { color: difficultyColors[practice.difficulty] }]}>
            {practice.difficulty.charAt(0).toUpperCase() + practice.difficulty.slice(1)}
          </Text>
          <Text style={styles.context}>• {practice.context}</Text>
        </View>
        {onShuffle && !isChecked && canShuffle && (
          <TouchableOpacity
            style={styles.shuffleButton}
            onPress={(e) => {
              e.stopPropagation();
              onShuffle();
            }}
            activeOpacity={0.6}
            accessibilityLabel="Shuffle practice"
            accessibilityHint="Replaces this practice with a different one"
            accessibilityRole="button"
          >
            <Ionicons name="shuffle" size={20} color={Colors.saffronGold} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title}>{practice.title}</Text>
      <Text style={styles.description}>{practice.description}</Text>
    </TouchableOpacity>
  );
});

export default PracticeCard;

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
  cardChecked: {
    backgroundColor: Colors.saffronGold08,
    opacity: 0.85,
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
  numberBadgeChecked: {
    backgroundColor: 'transparent',
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
  shuffleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.saffronGold08,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

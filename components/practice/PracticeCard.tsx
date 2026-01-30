import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Practice } from '../../types';

interface PracticeCardProps {
  practice: Practice;
  number: number;
  isChecked?: boolean;
  onToggle?: () => void;
  onShuffle?: () => void;
  canShuffle?: boolean;
  isFavorited?: boolean;
  onFavorite?: () => void;
}

const PracticeCard = React.memo(({
  practice,
  number,
  isChecked = false,
  onToggle,
  onShuffle,
  canShuffle = true,
  isFavorited = false,
  onFavorite,
}: PracticeCardProps) => {
  const difficultyColors = {
    easy: Colors.deepMoss,
    medium: Colors.saffronGold,
    challenging: Colors.burntSienna,
  };

  // Add organic variance based on card number
  const cardVariance = {
    borderRadius: 16 + (number % 3) * 2,  // 16, 18, or 20
    transform: [{ rotate: number % 2 === 1 ? '0.5deg' : '-0.3deg' }],
    borderLeftWidth: number % 2 === 0 ? 3 : 4,
    shadowRadius: number % 2 === 0 ? 8 : 12,
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        cardVariance,
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
        {onFavorite && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
            activeOpacity={0.6}
            accessibilityLabel={isFavorited ? "Remove from favorites" : "Add to favorites"}
            accessibilityRole="button"
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={20}
              color={isFavorited ? Colors.lotusPink : Colors.mediumStone}
            />
          </TouchableOpacity>
        )}
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
    padding: 20,
    borderLeftColor: Colors.saffronGold,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    elevation: 2,
    // borderRadius, borderLeftWidth, shadowRadius, and transform are applied dynamically
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
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lotusPink12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

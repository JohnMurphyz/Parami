import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Favorite, Practice } from '../types';
import { getParamiById } from '../data/paramis';

interface PracticeFavoriteCardProps {
  favorite: Favorite;
  practice: Practice;
  onRemove: (id: string) => void;
  onShare: (favorite: Favorite) => void;
  style?: any;
}

const PracticeFavoriteCard = ({ favorite, practice, onRemove, onShare, style }: PracticeFavoriteCardProps) => {
  const parami = getParamiById(favorite.paramiId);
  if (!parami) return null;

  const difficultyColors = {
    easy: Colors.deepMoss,
    medium: Colors.saffronGold,
    challenging: Colors.burntSienna,
  };

  return (
    <View style={[styles.favoriteCard, style]}>
      <View style={styles.favoriteHeader}>
        <View style={styles.favoriteTypeBadge}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.saffronGold} />
          <Text style={styles.favoriteTypeText}>Practice</Text>
        </View>
        <View style={styles.favoriteActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onShare(favorite)}
            activeOpacity={0.6}
            accessibilityLabel="Share practice"
            accessibilityRole="button"
          >
            <Ionicons name="share-outline" size={20} color={Colors.deepStone} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onRemove(favorite.id)}
            activeOpacity={0.6}
            accessibilityLabel="Remove from favorites"
            accessibilityRole="button"
          >
            <Ionicons name="heart" size={20} color={Colors.lotusPink} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.paramiLabel}>
        {parami.name} — {parami.englishName}
      </Text>

      <View style={styles.practiceContent}>
        <View style={styles.practiceMetadata}>
          <Text
            style={[
              styles.practiceDifficulty,
              { color: difficultyColors[practice.difficulty] },
            ]}
          >
            {practice.difficulty.charAt(0).toUpperCase() + practice.difficulty.slice(1)}
          </Text>
          <Text style={styles.practiceContext}>• {practice.context}</Text>
        </View>
        <Text style={styles.practiceTitle}>{practice.title}</Text>
        <Text style={styles.practiceDescription}>{practice.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  favoriteCard: {
    backgroundColor: Colors.saffronGold08,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderTopWidth: 2,
    borderTopColor: Colors.saffronGold40,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  favoriteTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.pureWhite,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  favoriteTypeText: {
    ...Typography.caption,
    color: Colors.deepStone,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  favoriteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.pureWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paramiLabel: {
    ...Typography.body,
    color: Colors.saffronGold,
    fontWeight: '600',
    marginBottom: 12,
  },
  practiceContent: {
    gap: 8,
  },
  practiceMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  practiceDifficulty: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  practiceContext: {
    ...Typography.caption,
    color: Colors.mediumStone,
    marginLeft: 4,
  },
  practiceTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
  },
  practiceDescription: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 22,
  },
});

export default PracticeFavoriteCard;

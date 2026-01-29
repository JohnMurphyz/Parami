import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Favorite, Practice } from '../types';
import QuoteFavoriteCard from './QuoteFavoriteCard';
import PracticeFavoriteCard from './PracticeFavoriteCard';

interface FavoritesGridProps {
  favorites: Favorite[];
  practiceData: Map<string, Practice>;
  onRemove: (id: string) => void;
  onShare: (favorite: Favorite) => void;
  maxDisplay?: number;
}

const FavoritesGrid = ({ favorites, practiceData, onRemove, onShare, maxDisplay = 6 }: FavoritesGridProps) => {
  const [showAll, setShowAll] = useState(false);

  const displayedFavorites = showAll ? favorites : favorites.slice(0, maxDisplay);
  const hasMore = favorites.length > maxDisplay;

  // Get organic styling based on index
  const getCardStyle = (index: number) => {
    const rotations = [0.3, -0.4, 0.2, -0.3, 0.5, -0.2];
    const radii = [16, 18, 14, 20, 16, 18];
    const offset = index % 2 === 0 ? 0 : 12;

    return {
      transform: [{ rotate: `${rotations[index % rotations.length]}deg` }],
      borderRadius: radii[index % radii.length],
      marginLeft: offset,
    };
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIllustration}>
          <Ionicons name="heart-outline" size={48} color={Colors.lotusPink} style={{ opacity: 0.4 }} />
          <Ionicons
            name="heart-outline"
            size={32}
            color={Colors.lotusPink}
            style={{ position: 'absolute', top: 8, left: 8, opacity: 0.7 }}
          />
        </View>
        <Text style={styles.emptyStateTitle}>Treasures to Return To</Text>
        <Text style={styles.emptyStateText}>
          When a quote or practice resonates, save it here. These become touchstones in your practice.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {displayedFavorites.map((favorite, index) => {
          const cardStyle = getCardStyle(index);

          if (favorite.type === 'quote') {
            return (
              <QuoteFavoriteCard
                key={favorite.id}
                favorite={favorite}
                onRemove={onRemove}
                onShare={onShare}
                style={cardStyle}
              />
            );
          } else {
            const practice = practiceData.get(favorite.itemId);
            if (!practice) return null;
            return (
              <PracticeFavoriteCard
                key={favorite.id}
                favorite={favorite}
                practice={practice}
                onRemove={onRemove}
                onShare={onShare}
                style={cardStyle}
              />
            );
          }
        })}
      </View>

      {hasMore && !showAll && (
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => setShowAll(true)}
          activeOpacity={0.7}
          accessibilityLabel="View all favorites"
          accessibilityRole="button"
        >
          <Text style={styles.viewAllText}>View All ({favorites.length})</Text>
          <Ionicons name="chevron-down" size={20} color={Colors.saffronGold} />
        </TouchableOpacity>
      )}

      {showAll && hasMore && (
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => setShowAll(false)}
          activeOpacity={0.7}
          accessibilityLabel="Show less favorites"
          accessibilityRole="button"
        >
          <Text style={styles.viewAllText}>Show Less</Text>
          <Ionicons name="chevron-up" size={20} color={Colors.saffronGold} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  gridContainer: {
    width: '100%',
  },
  emptyState: {
    backgroundColor: Colors.warmPaper,
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    transform: [{ rotate: '0.3deg' }],
  },
  emptyIllustration: {
    position: 'relative',
    width: 56,
    height: 56,
    marginBottom: 16,
  },
  emptyStateTitle: {
    ...Typography.h1,
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    ...Typography.bodyLarge,
    color: Colors.mediumStone,
    textAlign: 'center',
    lineHeight: 24,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.pureWhite,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  viewAllText: {
    ...Typography.body,
    color: Colors.saffronGold,
    fontWeight: '600',
  },
});

export default FavoritesGrid;

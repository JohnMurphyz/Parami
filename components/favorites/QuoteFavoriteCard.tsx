import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Favorite } from '../../types';
import { getParamiById } from '../../data/paramis';

interface QuoteFavoriteCardProps {
  favorite: Favorite;
  onRemove: (id: string) => void;
  onShare: (favorite: Favorite) => void;
  style?: any;
}

const QuoteFavoriteCard = ({ favorite, onRemove, onShare, style }: QuoteFavoriteCardProps) => {
  const parami = getParamiById(favorite.paramiId);
  if (!parami) return null;

  const quote = parami.quote;

  return (
    <View style={[styles.favoriteCard, style]}>
      <View style={styles.favoriteHeader}>
        <View style={styles.favoriteTypeBadge}>
          <Ionicons name="chatbox-ellipses" size={16} color={Colors.lotusPink} />
          <Text style={styles.favoriteTypeText}>Quote</Text>
        </View>
        <View style={styles.favoriteActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onShare(favorite)}
            activeOpacity={0.6}
            accessibilityLabel="Share quote"
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

      <View style={styles.quoteContent}>
        <Text style={styles.quoteText}>"{quote.text}"</Text>
        <Text style={styles.quoteAuthor}>— {quote.author}</Text>
        {quote.source && <Text style={styles.quoteSource}>{quote.source}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  favoriteCard: {
    backgroundColor: Colors.lotusPink12,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderTopWidth: 2,
    borderTopColor: Colors.lotusPink40,
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
  quoteContent: {
    gap: 8,
  },
  quoteText: {
    ...Typography.quote,
    color: Colors.deepCharcoal,
  },
  quoteAuthor: {
    ...Typography.body,
    color: Colors.deepStone,
    fontWeight: '600',
  },
  quoteSource: {
    ...Typography.caption,
    color: Colors.mediumStone,
  },
});

export default QuoteFavoriteCard;

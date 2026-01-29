import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { HistoryEntry, JournalEntry, Parami } from '../types';
import { getAvailablePractices } from '../services/contentService';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ExpandableHistoryCardProps {
  entry: HistoryEntry;
  journalEntry?: JournalEntry;
  parami: Parami;
  isExpanded: boolean;
  onToggleExpand: () => void;
  index: number;
}

const ExpandableHistoryCard = ({
  entry,
  journalEntry,
  parami,
  isExpanded,
  onToggleExpand,
  index,
}: ExpandableHistoryCardProps) => {
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggleExpand();
  };

  // Get organic styling based on index
  const cardStyle = {
    borderRadius: 14 + (index % 2) * 4, // 14 or 18
    transform: [{ rotate: index % 2 === 0 ? '0.3deg' : '-0.2deg' }],
    marginBottom: 14 + (index % 3) * 2, // 14, 16, or 18
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate days ago
  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  // Resolve practice IDs to practice titles
  const getPracticeTitles = () => {
    const allPractices = getAvailablePractices(entry.paramiId, []);
    return entry.practicesCompleted
      .map((practiceId) => {
        const practice = allPractices.find((p) => p.id === practiceId);
        return practice?.title || null;
      })
      .filter((title): title is string => title !== null);
  };

  const practiceTitles = getPracticeTitles();

  return (
    <TouchableOpacity
      style={[styles.card, cardStyle]}
      onPress={handleToggle}
      activeOpacity={0.7}
      accessibilityLabel={`History entry for ${formatDate(entry.date)}${isExpanded ? ', expanded' : ', collapsed'}`}
      accessibilityHint="Double tap to expand or collapse"
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
          <Text style={styles.daysAgo}>{getDaysAgo(entry.date)}</Text>
        </View>
        <View style={styles.headerRight}>
          {entry.practicesCompleted.length > 0 && (
            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.saffronGold} />
              <Text style={styles.badgeText}>{entry.practicesCompleted.length}</Text>
            </View>
          )}
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={Colors.mediumStone}
          />
        </View>
      </View>

      <Text style={styles.paramiName}>
        {parami.name} — {parami.englishName}
      </Text>

      {isExpanded && (
        <View style={styles.expandedContent}>
          {journalEntry && journalEntry.content.trim() && (
            <View style={styles.journalSection}>
              <View style={styles.journalHeader}>
                <Ionicons name="book" size={16} color={Colors.lotusPink} />
                <Text style={styles.journalLabel}>Journal Entry</Text>
              </View>
              <View style={styles.journalCard}>
                <Text style={styles.journalText}>{journalEntry.content}</Text>
              </View>
            </View>
          )}

          {practiceTitles.length > 0 && (
            <View style={styles.practicesSection}>
              <View style={styles.practicesHeader}>
                <Ionicons name="checkbox" size={16} color={Colors.saffronGold} />
                <Text style={styles.practicesLabel}>
                  Practices Completed ({practiceTitles.length})
                </Text>
              </View>
              {practiceTitles.map((title, idx) => (
                <View key={idx} style={styles.practiceItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.practiceTitle}>{title}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.pureWhite,
    padding: 20,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  date: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginBottom: 2,
  },
  daysAgo: {
    ...Typography.caption,
    color: Colors.mediumStone,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.saffronGold08,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.saffronGold,
    fontWeight: '600',
  },
  paramiName: {
    ...Typography.body,
    color: Colors.deepStone,
    fontWeight: '600',
    marginBottom: 4,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.warmStone,
    gap: 16,
  },
  journalSection: {
    gap: 8,
  },
  journalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  journalLabel: {
    ...Typography.h3,
    color: Colors.deepStone,
  },
  journalCard: {
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.lotusPink,
  },
  journalText: {
    ...Typography.journalEntry,
    color: Colors.deepStone,
  },
  practicesSection: {
    gap: 8,
  },
  practicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  practicesLabel: {
    ...Typography.h3,
    color: Colors.deepStone,
  },
  practiceItem: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 8,
  },
  bullet: {
    ...Typography.body,
    color: Colors.saffronGold,
    fontWeight: '600',
  },
  practiceTitle: {
    ...Typography.body,
    color: Colors.deepStone,
    flex: 1,
  },
});

export default ExpandableHistoryCard;

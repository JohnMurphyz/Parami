import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { loadJournalEntries } from '../services/storageService';
import { getParamiById } from '../services/firebaseContentService';
import { JournalEntry } from '../types';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import ScreenHeader from '../components/ScreenHeader';
import ParamiFilterDropdown from '../components/ParamiFilterDropdown';

export default function EntriesScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParamiIds, setSelectedParamiIds] = useState<number[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  // Reload entries when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    try {
      setLoading(true);
      const journalData = await loadJournalEntries();
      // Sort by most recent
      const sorted = journalData.sort((a, b) => b.date.localeCompare(a.date));
      setEntries(sorted);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filter entries based on selected paramis
  const filteredEntries = selectedParamiIds.length === 0
    ? entries
    : entries.filter(entry => selectedParamiIds.includes(entry.paramiId));

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.saffronGold} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Screen Header with Back Button and Filter */}
        <ScreenHeader
          title="Journal Entries"
          subtitle={`${filteredEntries.length} reflection${filteredEntries.length !== 1 ? 's' : ''}`}
          onBack={() => router.back()}
          renderFilter={() => (
            <ParamiFilterDropdown
              selectedParamiIds={selectedParamiIds}
              onSelectionChange={setSelectedParamiIds}
            />
          )}
        />

        {/* Show active filters */}
        {selectedParamiIds.length > 0 && (
          <View style={styles.activeFiltersRow}>
            <Text style={styles.activeFiltersLabel}>Filtering by:</Text>
            <View style={styles.filterChips}>
              {selectedParamiIds.map(id => {
                const parami = getParamiById(id);
                if (!parami) return null;
                return (
                  <View key={id} style={styles.filterChip}>
                    <Text style={styles.filterChipText}>{parami.name}</Text>
                    <TouchableOpacity
                      onPress={() => setSelectedParamiIds(ids => ids.filter(i => i !== id))}
                      activeOpacity={0.7}
                      accessibilityLabel={`Remove ${parami.name} filter`}
                      accessibilityRole="button"
                    >
                      <Ionicons name="close-circle" size={16} color={Colors.saffronGold} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Empty state or content */}
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIllustration}>
              <Ionicons name="book-outline" size={48} color={Colors.lotusPink} style={{ opacity: 0.4 }} />
              <Ionicons
                name="book-outline"
                size={32}
                color={Colors.lotusPink}
                style={{ position: 'absolute', top: 8, left: 8, opacity: 0.7 }}
              />
            </View>
            <Text style={styles.emptyStateTitle}>
              {selectedParamiIds.length > 0 ? 'No Matching Entries' : 'No Reflections Yet'}
            </Text>
            <Text style={styles.emptyStateText}>
              {selectedParamiIds.length > 0
                ? 'Try adjusting your filter to see more entries.'
                : 'Your journal entries will appear here as you write them. Begin your first reflection to start tracking your journey.'}
            </Text>
          </View>
        ) : (
          filteredEntries.map((entry, index) => {
            const parami = getParamiById(entry.paramiId);
            if (!parami) return null;

            return (
              <View key={`${entry.date}-${entry.paramiId}`} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDate}>
                    {formatDate(entry.date)}
                  </Text>
                  <Text style={styles.paramiName}>
                    {parami.name} — {parami.englishName}
                  </Text>
                </View>
                <Text style={styles.entryContent}>{entry.content}</Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmStone,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },
  activeFiltersRow: {
    marginBottom: 16,
  },
  activeFiltersLabel: {
    ...Typography.caption,
    color: Colors.mediumStone,
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.saffronGold08,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterChipText: {
    ...Typography.caption,
    color: Colors.saffronGold,
    fontWeight: '600',
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
    marginTop: 40,
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
  entryCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.lotusPink,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  entryHeader: {
    marginBottom: 12,
  },
  entryDate: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginBottom: 4,
  },
  paramiName: {
    ...Typography.caption,
    color: Colors.saffronGold,
    fontWeight: '600',
  },
  entryContent: {
    ...Typography.journalEntry,
    color: Colors.deepStone,
  },
});

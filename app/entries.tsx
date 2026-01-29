import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { loadAllReflectionEntries } from '../services/storageService';
import { getParamiById } from '../services/firebaseContentService';
import { ReflectionEntry, StructuredReflection } from '../types';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import ScreenHeader from '../components/ScreenHeader';
import ParamiFilterDropdown from '../components/ParamiFilterDropdown';
import StructuredEntryCard from '../components/StructuredEntryCard';
import StructuredEntryDetailModal from '../components/StructuredEntryDetailModal';

type EntryTypeFilter = 'all' | 'quick' | 'deep';

export default function EntriesScreen() {
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParamiIds, setSelectedParamiIds] = useState<number[]>([]);
  const [entryTypeFilter, setEntryTypeFilter] = useState<EntryTypeFilter>('all');
  const [selectedStructuredEntry, setSelectedStructuredEntry] = useState<StructuredReflection | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
      const allEntries = await loadAllReflectionEntries();
      // Sort by most recent (already sorted by loadAllReflectionEntries)
      setEntries(allEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStructuredEntryPress = (entry: StructuredReflection) => {
    setSelectedStructuredEntry(entry);
    setShowDetailModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filter entries based on selected paramis and entry type
  let filteredEntries = selectedParamiIds.length === 0
    ? entries
    : entries.filter(entry => selectedParamiIds.includes(entry.paramiId));

  // Apply entry type filter
  if (entryTypeFilter === 'quick') {
    filteredEntries = filteredEntries.filter(entry => entry.type === 'unstructured');
  } else if (entryTypeFilter === 'deep') {
    filteredEntries = filteredEntries.filter(entry => entry.type === 'structured');
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.saffronGold} />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Screen Header with Back Button and Filter */}
          <ScreenHeader
            title="Reflections"
            subtitle={`${filteredEntries.length} ${entryTypeFilter === 'all' ? 'total' : entryTypeFilter === 'deep' ? 'deep' : 'quick'} reflection${filteredEntries.length !== 1 ? 's' : ''}`}
            onBack={() => router.back()}
            renderFilter={() => (
              <ParamiFilterDropdown
                selectedParamiIds={selectedParamiIds}
                onSelectionChange={setSelectedParamiIds}
              />
            )}
          />

          {/* Entry Type Filter */}
          <View style={styles.entryTypeFilter}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                entryTypeFilter === 'all' && styles.filterButtonActive,
              ]}
              onPress={() => setEntryTypeFilter('all')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: entryTypeFilter === 'all' }}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  entryTypeFilter === 'all' && styles.filterButtonTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                entryTypeFilter === 'deep' && styles.filterButtonActive,
              ]}
              onPress={() => setEntryTypeFilter('deep')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: entryTypeFilter === 'deep' }}
            >
              <Ionicons
                name="flower"
                size={16}
                color={entryTypeFilter === 'deep' ? Colors.saffronGold : Colors.deepStone}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  entryTypeFilter === 'deep' && styles.filterButtonTextActive,
                ]}
              >
                Deep Reflections
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                entryTypeFilter === 'quick' && styles.filterButtonActive,
              ]}
              onPress={() => setEntryTypeFilter('quick')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: entryTypeFilter === 'quick' }}
            >
              <Ionicons
                name="create"
                size={16}
                color={entryTypeFilter === 'quick' ? Colors.saffronGold : Colors.deepStone}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  entryTypeFilter === 'quick' && styles.filterButtonTextActive,
                ]}
              >
                Quick Entries
              </Text>
            </TouchableOpacity>
          </View>

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
          filteredEntries.map((entry) => {
            const parami = getParamiById(entry.paramiId);
            if (!parami) return null;

            // Render structured entry card
            if (entry.type === 'structured') {
              return (
                <StructuredEntryCard
                  key={entry.id}
                  entry={entry}
                  paramiName={`${parami.name} — ${parami.englishName}`}
                  onPress={() => handleStructuredEntryPress(entry)}
                />
              );
            }

            // Render unstructured entry card
            return (
              <View key={entry.id} style={styles.entryCard}>
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

      {/* Structured Entry Detail Modal */}
      {selectedStructuredEntry && (
        <StructuredEntryDetailModal
          visible={showDetailModal}
          entry={selectedStructuredEntry}
          paramiName={`${getParamiById(selectedStructuredEntry.paramiId)?.name} — ${getParamiById(selectedStructuredEntry.paramiId)?.englishName}`}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedStructuredEntry(null);
          }}
        />
      )}
    </>
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
  entryTypeFilter: {
    flexDirection: 'row',
    backgroundColor: Colors.warmStone,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: Colors.pureWhite,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.deepStone,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: Colors.saffronGold,
    fontWeight: '700',
  },
});

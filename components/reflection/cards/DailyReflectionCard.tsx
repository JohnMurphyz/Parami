import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { Typography } from '../../../constants/Typography';
import SimplifiedReflectionModal from '../modals/SimplifiedReflectionModal';
import StructuredReflectionModal from '../modals/StructuredReflectionModal';
import { loadStructuredReflections, loadPreferences } from '../../../services/storageService';
import logger from '../../../utils/logger';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ReflectionMode = 'quick' | 'deep';

interface DailyReflectionCardProps {
  paramiId: number;
  journalText: string;
  onJournalChange: (text: string) => void;
  onSave: () => Promise<boolean>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onDeepReflectionComplete?: () => void;
}

const MAX_JOURNAL_LENGTH = 2000;

const DailyReflectionCard = ({
  paramiId,
  journalText,
  onJournalChange,
  onSave,
  isCollapsed,
  onToggleCollapse,
  onDeepReflectionComplete,
}: DailyReflectionCardProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const [mode, setMode] = useState<ReflectionMode>('quick');
  const [showDeepReflectionModal, setShowDeepReflectionModal] = useState(false);
  const [hasStructuredReflection, setHasStructuredReflection] = useState(false);
  const [reflectionMode, setReflectionMode] = useState<'simplified' | 'detailed'>('simplified');

  // Load reflection mode preference
  useEffect(() => {
    loadReflectionMode();
  }, []);

  // Check if there's a structured reflection for today
  useEffect(() => {
    checkForStructuredReflection();
  }, [paramiId]);

  const loadReflectionMode = async () => {
    try {
      const prefs = await loadPreferences();
      setReflectionMode(prefs.reflectionMode || 'simplified');
    } catch (error) {
      logger.error('Error loading reflection mode preference', error);
    }
  };

  const checkForStructuredReflection = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const reflections = await loadStructuredReflections();
      const todayReflection = reflections.find(
        (r) => r.date === today && r.paramiId === paramiId
      );
      setHasStructuredReflection(!!todayReflection);
    } catch (error) {
      logger.error('Error checking for structured reflection', error);
    }
  };

  const handleSubmit = async () => {
    if (!journalText.trim()) return;

    setIsSaving(true);
    const success = await onSave();

    if (success) {
      // Configure smooth animation
      LayoutAnimation.configureNext({
        duration: 300,
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
      });

      // Collapse immediately - spinner stays visible during animation
      onToggleCollapse();

      // Reset saving state after collapse starts
      setIsSaving(false);
    } else {
      // If save failed, reset the saving state
      setIsSaving(false);
    }
  };

  const handleExpand = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    onToggleCollapse();
  };

  const hasQuickEntry = journalText.length > 0;
  const hasAnyEntry = hasQuickEntry || hasStructuredReflection;

  // If collapsed, show minimal "todo" state
  if (isCollapsed) {
    return (
      <TouchableOpacity
        style={styles.collapsedCard}
        onPress={handleExpand}
        activeOpacity={0.7}
        accessibilityLabel={hasAnyEntry ? "Daily Reflection captured, tap to expand" : "Daily Reflection, tap to write"}
        accessibilityRole="button"
      >
        <Image
          source={require('../../../assets/parami-logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View style={styles.collapsedContent}>
          <View style={styles.collapsedTitleRow}>
            <Text style={styles.collapsedTitle}>Daily Reflection</Text>
            {hasAnyEntry && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.saffronGold} />
            )}
          </View>
          <Text style={styles.capturedText}>
            {hasStructuredReflection
              ? 'Deep Reflection Captured'
              : hasQuickEntry
              ? 'Quick Entry Captured'
              : 'Tap to reflect'}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={24} color={Colors.mediumStone} />
      </TouchableOpacity>
    );
  }

  const handleDeepReflectionComplete = () => {
    checkForStructuredReflection();
    onDeepReflectionComplete?.();
    setShowDeepReflectionModal(false);

    // Collapse the card after completion
    LayoutAnimation.configureNext({
      duration: 300,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    onToggleCollapse();
  };

  // Expanded state (editing/viewing full content)
  return (
    <>
      <View style={styles.expandedCard}>
        <View style={styles.expandedHeader}>
          <Image
            source={require('../../../assets/parami-logo.png')}
            style={styles.logoImageSmall}
            resizeMode="contain"
          />
          <Text style={styles.expandedTitle}>Daily Reflection</Text>
        </View>

        {/* Mode Switcher */}
        <View style={styles.modeSwitcher}>
          <TouchableOpacity
            style={[
              styles.modeTab,
              mode === 'quick' && styles.modeTabActive,
            ]}
            onPress={() => setMode('quick')}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === 'quick' }}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={mode === 'quick' ? Colors.saffronGold : Colors.deepStone}
            />
            <Text
              style={[
                styles.modeTabText,
                mode === 'quick' && styles.modeTabTextActive,
              ]}
            >
              Quick Entry
            </Text>
            {hasQuickEntry && (
              <View style={styles.modeBadge}>
                <Ionicons name="checkmark" size={12} color={Colors.pureWhite} />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeTab,
              mode === 'deep' && styles.modeTabActive,
            ]}
            onPress={() => setMode('deep')}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === 'deep' }}
          >
            <Ionicons
              name="flower-outline"
              size={18}
              color={mode === 'deep' ? Colors.saffronGold : Colors.deepStone}
            />
            <Text
              style={[
                styles.modeTabText,
                mode === 'deep' && styles.modeTabTextActive,
              ]}
            >
              Deep Reflection
            </Text>
            {hasStructuredReflection && (
              <View style={styles.modeBadge}>
                <Ionicons name="checkmark" size={12} color={Colors.pureWhite} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Entry Mode */}
        {mode === 'quick' && (
          <>
            <TextInput
              style={styles.journalInput}
              value={journalText}
              onChangeText={onJournalChange}
              placeholder="Begin writing..."
              placeholderTextColor={Colors.mediumStone}
              multiline
              maxLength={MAX_JOURNAL_LENGTH}
              textAlignVertical="top"
              accessibilityLabel="Journal entry"
              accessibilityHint="Write your daily reflection here"
            />

            <View style={styles.journalFooter}>
              <Text style={styles.characterCount}>
                {journalText.length} / {MAX_JOURNAL_LENGTH}
              </Text>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  showSuccessFeedback && styles.submitButtonSuccess,
                  (!journalText.trim() || isSaving) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!journalText.trim() || isSaving}
                activeOpacity={0.7}
                accessibilityLabel="Submit reflection"
                accessibilityRole="button"
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={Colors.pureWhite} />
                ) : showSuccessFeedback ? (
                  <Ionicons name="checkmark" size={20} color={Colors.pureWhite} />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Deep Reflection Mode */}
        {mode === 'deep' && (
          <View style={styles.deepReflectionContainer}>
            <View style={styles.deepReflectionInfo}>
              <Ionicons name="information-circle-outline" size={24} color={Colors.saffronGold} />
              <View style={styles.deepReflectionInfoText}>
                <Text style={styles.deepReflectionTitle}>Guided Contemplative Practice</Text>
                <Text style={styles.deepReflectionDescription}>
                  A structured reflection practice based on Buddhist principles. {reflectionMode === 'simplified' ? 'Complete 3 sections tracking mind & intention, experience & response, and integration.' : 'Complete 7 sections tracking ego patterns, mental cultivation, and resilience.'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.beginDeepReflectionButton}
              onPress={() => setShowDeepReflectionModal(true)}
              activeOpacity={0.7}
              accessibilityLabel={hasStructuredReflection ? "View or edit deep reflection" : "Begin deep reflection"}
              accessibilityRole="button"
            >
              <Ionicons
                name={hasStructuredReflection ? "eye-outline" : "compass-outline"}
                size={20}
                color={Colors.pureWhite}
              />
              <Text style={styles.beginDeepReflectionText}>
                {hasStructuredReflection ? 'View Deep Reflection' : 'Begin Deep Reflection'}
              </Text>
            </TouchableOpacity>

            {hasStructuredReflection && (
              <Text style={styles.deepReflectionCompleteNote}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.deepMoss} /> Your deep reflection for today is captured
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Deep Reflection Modal - Conditionally render based on preference */}
      {reflectionMode === 'simplified' ? (
        <SimplifiedReflectionModal
          visible={showDeepReflectionModal}
          paramiId={paramiId}
          onClose={() => setShowDeepReflectionModal(false)}
          onComplete={handleDeepReflectionComplete}
        />
      ) : (
        <StructuredReflectionModal
          visible={showDeepReflectionModal}
          paramiId={paramiId}
          onClose={() => setShowDeepReflectionModal(false)}
          onComplete={handleDeepReflectionComplete}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // Expanded State
  expandedCard: {
    backgroundColor: Colors.saffronGold08,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderTopWidth: 3,
    borderTopColor: Colors.saffronGold,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  logoImageSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.deepMoss,
  },
  expandedTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    flex: 1,
  },
  journalInput: {
    ...Typography.journalEntry,
    backgroundColor: Colors.pureWhite,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.softAsh,
  },
  journalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  characterCount: {
    ...Typography.caption,
    color: Colors.mediumStone,
  },
  submitButton: {
    backgroundColor: Colors.saffronGold,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonText: {
    ...Typography.body,
    color: Colors.pureWhite,
    fontWeight: '600',
  },
  submitButtonSuccess: {
    backgroundColor: Colors.deepMoss,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.mediumStone,
    opacity: 0.5,
  },
  // Collapsed State
  collapsedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.saffronGold08,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    borderTopWidth: 3,
    borderTopColor: Colors.saffronGold,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.deepMoss,
  },
  collapsedContent: {
    flex: 1,
    gap: 2,
  },
  collapsedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collapsedTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
  },
  capturedText: {
    ...Typography.caption,
    color: Colors.saffronGold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Mode Switcher
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.warmStone,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  modeTabActive: {
    backgroundColor: Colors.pureWhite,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  modeTabText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.deepStone,
    fontWeight: '500',
  },
  modeTabTextActive: {
    color: Colors.saffronGold,
    fontWeight: '700',
  },
  modeBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.deepMoss,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  // Deep Reflection Mode
  deepReflectionContainer: {
    gap: 16,
  },
  deepReflectionInfo: {
    flexDirection: 'row',
    backgroundColor: Colors.pureWhite,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.softAsh,
  },
  deepReflectionInfoText: {
    flex: 1,
    gap: 6,
  },
  deepReflectionTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.deepCharcoal,
  },
  deepReflectionDescription: {
    ...Typography.caption,
    color: Colors.deepStone,
    lineHeight: 18,
  },
  beginDeepReflectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.saffronGold,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  beginDeepReflectionText: {
    ...Typography.body,
    color: Colors.pureWhite,
    fontWeight: '700',
  },
  deepReflectionCompleteNote: {
    ...Typography.caption,
    color: Colors.deepMoss,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default DailyReflectionCard;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DailyReflectionCardProps {
  paramiId: number;
  journalText: string;
  onJournalChange: (text: string) => void;
  onSave: () => Promise<boolean>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const MAX_JOURNAL_LENGTH = 2000;

const DailyReflectionCard = ({
  paramiId,
  journalText,
  onJournalChange,
  onSave,
  isCollapsed,
  onToggleCollapse,
}: DailyReflectionCardProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);

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

  // If collapsed, show minimal "todo" state
  if (isCollapsed) {
    return (
      <TouchableOpacity
        style={styles.collapsedCard}
        onPress={handleExpand}
        activeOpacity={0.7}
        accessibilityLabel={journalText.length > 0 ? "Daily Reflection captured, tap to expand" : "Daily Reflection, tap to write"}
        accessibilityRole="button"
      >
        <Image
          source={require('../assets/parami-logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View style={styles.collapsedContent}>
          <View style={styles.collapsedTitleRow}>
            <Text style={styles.collapsedTitle}>Daily Reflection</Text>
            {journalText.length > 0 && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.saffronGold} />
            )}
          </View>
          <Text style={styles.capturedText}>
            {journalText.length > 0 ? 'Captured' : 'Tap to reflect'}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={24} color={Colors.mediumStone} />
      </TouchableOpacity>
    );
  }

  // Expanded state (editing/viewing full content)
  return (
    <View style={styles.expandedCard}>
      <View style={styles.expandedHeader}>
        <Image
          source={require('../assets/parami-logo.png')}
          style={styles.logoImageSmall}
          resizeMode="contain"
        />
        <Text style={styles.expandedTitle}>Daily Reflection</Text>
      </View>

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
    </View>
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
});

export default DailyReflectionCard;

import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Keyboard, Platform } from 'react-native';
import { Parami } from '../../types';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import PracticeCard from '../PracticeCard';

interface WizardScreen3Props {
  parami: Parami;
  customPractice: string;
  onCustomPracticeChange: (text: string) => void;
  onBegin: () => void;
  isActive: boolean;
}

export default function WizardScreen3({
  parami,
  customPractice,
  onCustomPracticeChange,
  onBegin,
}: WizardScreen3Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleInputFocus = () => {
    // Wait a bit for keyboard to start appearing
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(40, keyboardHeight - 60) }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
          <View style={styles.header}>
            <Text style={styles.headerText}>Practice Today</Text>
            <Text style={styles.subtitle}>
              Choose one practice to cultivate this Parami:
            </Text>
          </View>

          {/* Practice Cards */}
          <View style={styles.practicesSection}>
            {parami.practices.map((practice, index) => (
              <View key={practice.id} style={styles.practiceCardWrapper}>
                <PracticeCard practice={practice} number={index + 1} />
              </View>
            ))}
          </View>

          {/* Custom Practice Input */}
          <View style={styles.customSection}>
            <Text style={styles.sectionLabel}>Your Own Practice</Text>
            <Text style={styles.customHint}>
              Or create your own way to practice {parami.englishName} today:
            </Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Enter your personal practice..."
              placeholderTextColor={Colors.mediumStone}
              value={customPractice}
              onChangeText={onCustomPracticeChange}
              onFocus={handleInputFocus}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Begin Button */}
          <TouchableOpacity style={styles.beginButton} onPress={onBegin}>
            <Text style={styles.beginButtonText}>Begin Your Day</Text>
          </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmStone,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    // paddingBottom is now dynamic, set via inline style
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerText: {
    ...Typography.h3,
    color: Colors.saffronGold,
    marginBottom: 12,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.mediumStone,
    textAlign: 'center',
  },
  practicesSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  practiceCardWrapper: {
    marginBottom: 16,
  },
  customSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionLabel: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
    marginBottom: 8,
  },
  customHint: {
    ...Typography.body,
    color: Colors.mediumStone,
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 16,
    ...Typography.body,
    color: Colors.deepCharcoal,
    minHeight: 100,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  beginButton: {
    marginHorizontal: 24,
    backgroundColor: Colors.saffronGold,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  beginButtonText: {
    ...Typography.h2,
    color: Colors.pureWhite,
    fontWeight: '700',
  },
});

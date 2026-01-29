import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { updatePreference } from '../../services/storageService';

export default function QuizPromptScreen() {
  const handleTakeQuiz = async () => {
    await updatePreference('hasCompletedOnboarding', true);
    router.replace('/quiz');
  };

  const handleSkip = async () => {
    await updatePreference('hasCompletedOnboarding', true);
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="compass" size={64} color={Colors.saffronGold} />
        </View>
        <Text style={styles.title}>Establish Your Baseline</Text>
        <Text style={styles.description}>
          Before you begin, would you like to take The Crossing Over Diagnostic? This will help you understand which paramis are already strong and which areas invite your attention.
        </Text>
      </View>

      <View style={styles.benefitsCard}>
        <Text style={styles.benefitsTitle}>What You'll Discover</Text>
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.deepMoss} />
            <Text style={styles.benefitText}>Your natural strengths across the 10 paramis</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.deepMoss} />
            <Text style={styles.benefitText}>Areas ready for growth and development</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.deepMoss} />
            <Text style={styles.benefitText}>Personalized insights from Buddhist teachings</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.deepMoss} />
            <Text style={styles.benefitText}>A roadmap for where to focus your practice</Text>
          </View>
        </View>
        <Text style={styles.timeNote}>Takes about 5 minutes · 10 questions</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.takeQuizButton}
          onPress={handleTakeQuiz}
          activeOpacity={0.7}
          accessibilityLabel="Take The Crossing Over Diagnostic"
          accessibilityRole="button"
        >
          <Text style={styles.takeQuizButtonText}>Take the Diagnostic</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
          accessibilityLabel="Skip for now"
          accessibilityRole="button"
        >
          <Text style={styles.skipButtonText}>Skip for Now</Text>
        </TouchableOpacity>

        <Text style={styles.skipNote}>
          You can always take it later from the Journey tab
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmStone,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    ...Typography.h1,
    color: Colors.deepCharcoal,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    ...Typography.bodyLarge,
    color: Colors.mediumStone,
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitsTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitText: {
    ...Typography.body,
    color: Colors.deepStone,
    flex: 1,
    lineHeight: 22,
  },
  timeNote: {
    ...Typography.caption,
    color: Colors.saffronGold,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 8,
  },
  actions: {
    gap: 12,
    alignItems: 'center',
  },
  takeQuizButton: {
    backgroundColor: Colors.saffronGold,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  takeQuizButtonText: {
    ...Typography.h2,
    color: Colors.pureWhite,
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    ...Typography.body,
    color: Colors.mediumStone,
    fontWeight: '600',
  },
  skipNote: {
    ...Typography.caption,
    color: Colors.mediumStone,
    textAlign: 'center',
    marginTop: 8,
  },
});

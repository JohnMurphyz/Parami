import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    router.push('/onboarding/permissions');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Parami</Text>
        <Text style={styles.subtitle}>
          Daily wisdom and practice for spiritual growth
        </Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What are Param is?</Text>
          <Text style={styles.infoText}>
            The 10 Paramis are Buddhist virtues or "perfections" that guide us toward
            wisdom, compassion, and inner peace.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>
            Each day, you'll receive a different Parami with:
          </Text>
          <Text style={styles.bulletPoint}>• Inspiring quotes and stories</Text>
          <Text style={styles.bulletPoint}>• Practical suggestions for daily practice</Text>
          <Text style={styles.bulletPoint}>• Space to create your own practices</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>The Journey</Text>
          <Text style={styles.infoText}>
            The app cycles through all 10 Paramis without repetition, ensuring you
            explore each virtue before any repeats.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
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
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.saffronGold,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: Colors.mediumStone,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: Colors.pureWhite,
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginBottom: 12,
  },
  infoText: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 24,
  },
  bulletPoint: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 28,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: Colors.saffronGold,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    ...Typography.h2,
    color: Colors.pureWhite,
    fontWeight: '700',
  },
});

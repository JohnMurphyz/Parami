import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
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
        <Text style={styles.title}>Welcome to Paramis</Text>
        <Text style={styles.subtitle}>
          Daily wisdom and practice for spiritual growth
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/wisdom-image.jpeg')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoCard}>
        <View style={styles.cardContent}>
          <Text style={styles.infoTitle}>Your Daily Practice</Text>
          <Text style={styles.infoText}>
            The 10 Paramis are Buddhist virtues or "perfections" that guide us toward
            wisdom, compassion, and inner peace.
          </Text>
          <Text style={styles.infoText}>
            Each day brings a new Parami with inspiring quotes, stories, and practical
            suggestions to help you cultivate these qualities in your life.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          accessibilityLabel="Get started"
          accessibilityHint="Begins the onboarding process to set up notifications"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
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
    flexGrow: 1,
    paddingTop: 80,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: Colors.saffronGold,
  },
  infoCard: {
    backgroundColor: Colors.pureWhite,
    paddingTop: 40,
    paddingHorizontal: 32,
    paddingBottom: 48,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flex: 1,
    justifyContent: 'space-between',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.saffronGold,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 17,
    color: Colors.deepStone,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 20,
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

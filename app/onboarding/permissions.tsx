import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { requestNotificationPermissions } from '../../services/notificationService';
import { updatePreference } from '../../services/storageService';

export default function PermissionsScreen() {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    try {
      const hasPermission = await requestNotificationPermissions();
      await updatePreference('notificationsEnabled', hasPermission);
      router.push('/onboarding/time-setup');
    } catch (error) {
      console.error('Error requesting permissions:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = async () => {
    await updatePreference('notificationsEnabled', false);
    router.push('/onboarding/time-setup');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="notifications-outline" size={64} color={Colors.saffronGold} />
        </View>
      </View>

      <View style={styles.textContent}>
        <Text style={styles.title}>Daily Reminders</Text>
        <Text style={styles.description}>
          Receive a gentle daily notification to remind you of your Parami practice.
        </Text>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Why enable notifications?</Text>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.saffronGold} />
            <Text style={styles.benefitText}>Stay consistent with daily practice</Text>
          </View>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.saffronGold} />
            <Text style={styles.benefitText}>Get reminded at your preferred time</Text>
          </View>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.saffronGold} />
            <Text style={styles.benefitText}>Build a meaningful daily habit</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleEnableNotifications}
          disabled={isRequesting}
          accessibilityLabel="Enable notifications"
          accessibilityHint="Requests permission to send daily practice reminders"
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>
            {isRequesting ? 'Requesting...' : 'Enable Notifications'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleSkip}
          accessibilityLabel="Skip notifications"
          accessibilityHint="Continues to time setup without enabling notifications"
          accessibilityRole="button"
        >
          <Text style={styles.secondaryButtonText}>Skip for Now</Text>
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
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.saffronGold08,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.saffronGold40,
  },
  textContent: {
    marginBottom: 32,
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
    marginBottom: 32,
  },
  benefitsCard: {
    backgroundColor: Colors.pureWhite,
    padding: 24,
    borderRadius: 16,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitsTitle: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
    marginBottom: 16,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  benefitText: {
    ...Typography.body,
    color: Colors.deepStone,
    flex: 1,
  },
  buttons: {
    gap: 12,
  },
  primaryButton: {
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
  primaryButtonText: {
    ...Typography.h2,
    color: Colors.pureWhite,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...Typography.body,
    color: Colors.mediumStone,
    fontWeight: '600',
  },
});

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { requestNotificationPermissions, scheduleNotification } from '../../services/notificationService';
import { updatePreference } from '../../services/storageService';
import { formatTimeDisplay, timeStringToDate } from '../../utils/dateUtils';
import { logger } from '../../utils/logger';

export default function PermissionsScreen() {
  const [isRequesting, setIsRequesting] = useState(false);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(timeStringToDate('09:00'));

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (selectedDate) {
      setTempTime(selectedDate);

      if (Platform.OS === 'android') {
        saveTimeChange(selectedDate);
      }
    }
  };

  const handleTimePress = () => {
    setShowTimePicker(true);
  };

  const handleTimeDone = () => {
    setShowTimePicker(false);
    saveTimeChange(tempTime);
  };

  const saveTimeChange = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    setNotificationTime(timeString);
  };

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    try {
      const hasPermission = await requestNotificationPermissions();
      await updatePreference('notificationsEnabled', hasPermission);
      await updatePreference('notificationTime', notificationTime);

      if (hasPermission) {
        await scheduleNotification(notificationTime);
      }

      router.push('/onboarding/quiz-prompt');
    } catch (error) {
      logger.error('Error requesting permissions', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = async () => {
    await updatePreference('notificationsEnabled', false);
    router.push('/onboarding/quiz-prompt');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="notifications-outline" size={64} color={Colors.saffronGold} />
        </View>
      </View>

      <Text style={styles.title}>Daily Reminders</Text>
      <Text style={styles.description}>
        Get a gentle reminder each day for your Parami practice
      </Text>

      <View style={styles.timeCard}>
        <Text style={styles.timeLabel}>Reminder time</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={handleTimePress}
          accessibilityLabel={`Notification time: ${formatTimeDisplay(notificationTime)}`}
          accessibilityHint="Opens time picker to select daily reminder time"
          accessibilityRole="button"
        >
          <Text style={styles.timeButtonText}>{formatTimeDisplay(notificationTime)}</Text>
        </TouchableOpacity>
      </View>

      {showTimePicker && Platform.OS === 'ios' && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={tempTime}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
            textColor={Colors.deepCharcoal}
          />
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleTimeDone}
            accessibilityLabel="Done selecting time"
            accessibilityHint="Saves the selected notification time"
            accessibilityRole="button"
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}

      {showTimePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

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
          accessibilityHint="Continues without enabling notifications"
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
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'center',
    flexGrow: 1,
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
    marginBottom: 48,
  },
  timeCard: {
    backgroundColor: Colors.pureWhite,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  timeLabel: {
    ...Typography.body,
    color: Colors.mediumStone,
    marginBottom: 16,
    fontWeight: '600',
  },
  timeButton: {
    backgroundColor: Colors.saffronGold,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  timeButtonText: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.pureWhite,
  },
  pickerContainer: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  doneButton: {
    backgroundColor: Colors.saffronGold,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  doneButtonText: {
    ...Typography.h3,
    color: Colors.pureWhite,
    fontWeight: '700',
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

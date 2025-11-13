import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { updatePreference, loadPreferences } from '../../services/storageService';
import { scheduleNotification } from '../../services/notificationService';

export default function TimeSetupScreen() {
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const preferences = await loadPreferences();
    setNotificationsEnabled(preferences.notificationsEnabled);
    setNotificationTime(preferences.notificationTime);

    const [hours, minutes] = preferences.notificationTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    setTempTime(date);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
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

  const handleComplete = async () => {
    await updatePreference('notificationTime', notificationTime);
    await updatePreference('hasCompletedOnboarding', true);

    if (notificationsEnabled) {
      await scheduleNotification(notificationTime);
    }

    router.replace('/(tabs)');
  };

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Time</Text>
        <Text style={styles.description}>
          {notificationsEnabled
            ? 'When would you like to receive your daily Parami reminder?'
            : 'You can always enable notifications later in Settings'}
        </Text>
      </View>

      {notificationsEnabled && (
        <>
          <View style={styles.timeCard}>
            <Text style={styles.timeLabel}>Notification Time</Text>
            <TouchableOpacity style={styles.timeButton} onPress={handleTimePress}>
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
              <TouchableOpacity style={styles.doneButton} onPress={handleTimeDone}>
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
        </>
      )}

      <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
        <Text style={styles.completeButtonText}>
          {notificationsEnabled ? 'Complete Setup' : 'Continue to App'}
        </Text>
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
    marginBottom: 40,
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
  },
  timeCard: {
    backgroundColor: Colors.pureWhite,
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  timeLabel: {
    ...Typography.h3,
    color: Colors.mediumStone,
    marginBottom: 16,
  },
  timeButton: {
    backgroundColor: Colors.saffronGold,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  timeButtonText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.pureWhite,
  },
  pickerContainer: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
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
  completeButton: {
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
  completeButtonText: {
    ...Typography.h2,
    color: Colors.pureWhite,
    fontWeight: '700',
  },
});

import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { loadPreferences, updatePreference } from '../../services/storageService';
import { scheduleNotification, cancelAllNotifications } from '../../services/notificationService';
import { formatTimeDisplay, timeStringToDate } from '../../utils/dateUtils';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [loading, setLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const preferences = await loadPreferences();
      setNotificationsEnabled(preferences.notificationsEnabled);
      setNotificationTime(preferences.notificationTime);

      // Convert time string to Date object
      setTempTime(timeStringToDate(preferences.notificationTime));
    } catch (error) {
      // Settings will use defaults if loading fails
      Alert.alert(
        'Settings Error',
        'Unable to load saved settings. Using default values.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    try {
      setNotificationsEnabled(value);
      await updatePreference('notificationsEnabled', value);

      if (value) {
        await scheduleNotification(notificationTime);
      } else {
        await cancelAllNotifications();
      }
    } catch (error) {
      // Revert toggle on failure
      setNotificationsEnabled(!value);
      Alert.alert(
        'Notification Error',
        'Unable to update notification settings. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTimePress = () => {
    setShowTimePicker(true);
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (selectedDate) {
      setTempTime(selectedDate);

      // For Android, save immediately
      if (Platform.OS === 'android') {
        saveTimeChange(selectedDate);
      }
    }
  };

  const handleTimeDone = () => {
    setShowTimePicker(false);
    saveTimeChange(tempTime);
  };

  const saveTimeChange = async (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    setNotificationTime(timeString);
    await updatePreference('notificationTime', timeString);

    if (notificationsEnabled) {
      await scheduleNotification(timeString);
    }
  };

  const handleRestartOnboarding = () => {
    Alert.alert(
      'Restart Onboarding',
      'This will reset the onboarding flow and take you back to the welcome screen. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Restart',
          onPress: async () => {
            await updatePreference('hasCompletedOnboarding', false);
            router.replace('/onboarding');
          },
        },
      ]
    );
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Daily Reminder</Text>
              <Text style={styles.settingDescription}>
                Receive a daily notification with today's Parami
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: Colors.softAsh, true: Colors.saffronGold }}
              thumbColor={Colors.pureWhite}
              ios_backgroundColor={Colors.softAsh}
            />
          </View>

          {notificationsEnabled && (
            <>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Notification Time</Text>
                  <Text style={styles.settingDescription}>
                    When to receive your daily reminder
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={handleTimePress}
                  accessibilityLabel={`Notification time: ${formatTimeDisplay(notificationTime)}`}
                  accessibilityHint="Opens time picker to change daily notification time"
                  accessibilityRole="button"
                >
                  <Text style={styles.timeButtonText}>
                    {formatTimeDisplay(notificationTime)}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Time Picker (iOS) */}
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

              {/* Time Picker (Android) */}
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
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoCard}>
            <Text style={styles.aboutTitle}>Parami</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutDescription}>
              Daily Buddhist wisdom and practice suggestions based on the 10 Paramis
              (perfections). Each day features a different Parami with inspiring quotes
              and practical ways to embody these qualities in your life.
            </Text>
          </View>

          <Text style={styles.paramiListTitle}>The 10 Paramis:</Text>
          {[
            '1. Dana — Generosity',
            '2. Sila — Virtue',
            '3. Nekkhamma — Renunciation',
            '4. Panna — Wisdom',
            '5. Viriya — Energy',
            '6. Khanti — Patience',
            '7. Sacca — Truthfulness',
            '8. Adhitthana — Determination',
            '9. Metta — Loving-kindness',
            '10. Upekkha — Equanimity',
          ].map((parami) => (
            <Text key={parami} style={styles.paramiListItem}>
              {parami}
            </Text>
          ))}

          {/* Test Button for Onboarding */}
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleRestartOnboarding}
            accessibilityLabel="Restart onboarding"
            accessibilityHint="Resets the app to show the welcome screen and onboarding flow again"
            accessibilityRole="button"
          >
            <Text style={styles.testButtonText}>Restart Onboarding</Text>
          </TouchableOpacity>
        </View>
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
    padding: 24,
    paddingBottom: 48,
  },
  loadingText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 40,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    ...Typography.h1,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.pureWhite,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    ...Typography.h2,
    marginBottom: 6,
  },
  settingDescription: {
    ...Typography.body,
    color: Colors.mediumStone,
  },
  timeButton: {
    backgroundColor: Colors.saffronGold08,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.saffronGold,
  },
  timeButtonText: {
    ...Typography.body,
    color: Colors.saffronGold,
    fontWeight: '700',
  },
  pickerContainer: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
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
  infoCard: {
    backgroundColor: Colors.pureWhite,
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  aboutTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.saffronGold,
    marginBottom: 4,
  },
  aboutVersion: {
    ...Typography.caption,
    marginBottom: 16,
  },
  aboutDescription: {
    ...Typography.body,
  },
  paramiListTitle: {
    ...Typography.h2,
    marginBottom: 16,
  },
  paramiListItem: {
    ...Typography.body,
    lineHeight: 32,
    paddingLeft: 8,
  },
  testButton: {
    marginTop: 32,
    backgroundColor: Colors.mediumStone,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  testButtonText: {
    ...Typography.body,
    color: Colors.pureWhite,
    fontWeight: '600',
  },
});

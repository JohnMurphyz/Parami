import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  renderFilter?: () => React.ReactNode;
}

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  renderFilter
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Navigation Row */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.deepCharcoal} />
        </TouchableOpacity>

        {renderFilter && (
          <View style={styles.filterContainer}>
            {renderFilter()}
          </View>
        )}
      </View>

      {/* Title Section */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.pureWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  filterContainer: {
    // Filter component will be rendered here
  },
  headerSection: {
    // Lowered header position
  },
  title: {
    ...Typography.h1,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.mediumStone,
  },
});

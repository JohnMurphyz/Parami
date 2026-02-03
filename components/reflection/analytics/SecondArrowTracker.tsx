import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SecondArrowStats } from '../../../utils/reflectionAnalytics';
import { Colors } from '../../../constants/Colors';
import { Typography } from '../../../constants/Typography';

interface SecondArrowTrackerProps {
  secondArrowStats: SecondArrowStats;
}

export default function SecondArrowTracker({ secondArrowStats }: SecondArrowTrackerProps) {
  const { occurrences } = secondArrowStats;

  return (
    <View style={styles.container}>
      <Ionicons name="git-compare-outline" size={24} color={Colors.lotusPink} />
      <View style={styles.content}>
        <Text style={styles.title}>The Second Arrow</Text>
        <Text style={styles.subtitle}>Mental grief added to pain</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>{occurrences}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.pureWhite,
    borderRadius: 18,
    padding: 20,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    fontSize: 18,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.deepStone,
    fontSize: 13,
  },
  statBox: {
    backgroundColor: Colors.saffronGold08,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    ...Typography.h1,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.saffronGold,
  },
});

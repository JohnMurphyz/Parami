import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface QuizProgressBarProps {
  current: number; // Current question (1-10)
  total: number; // Total questions (10)
}

export default function QuizProgressBar({ current, total }: QuizProgressBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Question {current} of {total}</Text>
      <View style={styles.barContainer}>
        {Array.from({ length: total }).map((_, index) => {
          const questionNumber = index + 1;
          let segmentStyle = styles.segmentRemaining;

          if (questionNumber < current) {
            // Completed segment
            segmentStyle = styles.segmentCompleted;
          } else if (questionNumber === current) {
            // Current segment
            segmentStyle = styles.segmentCurrent;
          }

          return (
            <View
              key={index}
              style={[styles.segment, segmentStyle]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    ...Typography.caption,
    color: Colors.mediumStone,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  barContainer: {
    flexDirection: 'row',
    gap: 4,
    height: 6,
  },
  segment: {
    flex: 1,
    borderRadius: 3,
  },
  segmentCompleted: {
    backgroundColor: Colors.saffronGold,
  },
  segmentCurrent: {
    backgroundColor: Colors.lotusPink,
  },
  segmentRemaining: {
    backgroundColor: Colors.softAsh,
  },
});

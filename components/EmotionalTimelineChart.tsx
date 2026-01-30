import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmotionalTrend } from '../utils/reflectionAnalytics';
import { EmotionalState } from '../types';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface EmotionalTimelineChartProps {
  trends: EmotionalTrend[];
}

const EMOTIONAL_STATE_COLORS: Record<EmotionalState, string> = {
  peaceful: Colors.emotionalPeaceful,
  grateful: Colors.emotionalGrateful,
  challenged: Colors.emotionalChallenged,
  restless: Colors.emotionalRestless,
  discouraged: Colors.emotionalDiscouraged,
};

const EMOTIONAL_STATE_LABELS: Record<EmotionalState, string> = {
  peaceful: 'Peaceful',
  grateful: 'Grateful',
  challenged: 'Challenged',
  restless: 'Restless',
  discouraged: 'Discouraged',
};

const EMOTIONAL_STATE_Y_VALUES: Record<EmotionalState, number> = {
  peaceful: 5,
  grateful: 4,
  challenged: 3,
  restless: 2,
  discouraged: 1,
};

export default function EmotionalTimelineChart({ trends }: EmotionalTimelineChartProps) {
  if (trends.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="analytics-outline" size={48} color={Colors.mediumStone} style={{ opacity: 0.3 }} />
        <Text style={styles.emptyText}>No emotional data yet</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;
  const chartPadding = 40;
  const chartWidth = Math.max(screenWidth - chartPadding * 2, trends.length * 40);
  const chartHeight = 200;

  // Calculate point positions
  const xStep = chartWidth / (trends.length > 1 ? trends.length - 1 : 1);
  const yScale = (chartHeight - 40) / 4; // 5 emotional states, 4 intervals

  const points = trends.map((trend, index) => ({
    x: index * xStep,
    y: chartHeight - 20 - (EMOTIONAL_STATE_Y_VALUES[trend.emotionalState] - 1) * yScale,
    emotionalState: trend.emotionalState,
    date: trend.date,
    resilienceLevel: trend.resilienceLevel,
  }));

  // Generate path for line chart
  const linePath = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${path} L ${point.x} ${point.y}`;
  }, '');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emotional Timeline</Text>
        <Text style={styles.subtitle}>Track your emotional journey over time</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={[styles.chartContainer, { width: chartWidth + 40, height: chartHeight + 60 }]}>
          {/* Y-axis labels */}
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>Peaceful</Text>
            <Text style={styles.yAxisLabel}>Grateful</Text>
            <Text style={styles.yAxisLabel}>Challenged</Text>
            <Text style={styles.yAxisLabel}>Restless</Text>
            <Text style={styles.yAxisLabel}>Discouraged</Text>
          </View>

          {/* Chart area */}
          <View style={[styles.chart, { width: chartWidth, height: chartHeight }]}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={[
                  styles.gridLine,
                  { top: i * yScale + 20 },
                ]}
              />
            ))}

            {/* Data points */}
            {points.map((point, index) => (
              <View key={index}>
                {/* Line segment */}
                {index > 0 && (
                  <View
                    style={[
                      styles.lineSegment,
                      {
                        left: points[index - 1].x,
                        top: points[index - 1].y,
                        width: Math.sqrt(
                          Math.pow(point.x - points[index - 1].x, 2) +
                            Math.pow(point.y - points[index - 1].y, 2)
                        ),
                        transform: [
                          {
                            rotate: `${Math.atan2(
                              point.y - points[index - 1].y,
                              point.x - points[index - 1].x
                            )}rad`,
                          },
                        ],
                        backgroundColor: EMOTIONAL_STATE_COLORS[point.emotionalState],
                      },
                    ]}
                  />
                )}

                {/* Data point dot */}
                <View
                  style={[
                    styles.dataPoint,
                    {
                      left: point.x - 6,
                      top: point.y - 6,
                      backgroundColor: EMOTIONAL_STATE_COLORS[point.emotionalState],
                      borderColor: EMOTIONAL_STATE_COLORS[point.emotionalState],
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          {/* X-axis labels (dates) */}
          <View style={[styles.xAxis, { width: chartWidth }]}>
            {points.map((point, index) => {
              const date = new Date(point.date);
              const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              // Show every nth label to avoid crowding
              const showLabel = trends.length <= 7 || index % Math.ceil(trends.length / 7) === 0;

              return (
                <Text
                  key={index}
                  style={[
                    styles.xAxisLabel,
                    {
                      left: point.x - 20,
                      opacity: showLabel ? 1 : 0,
                    },
                  ]}
                >
                  {label}
                </Text>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        {(Object.keys(EMOTIONAL_STATE_COLORS) as EmotionalState[]).map((state) => (
          <View key={state} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: EMOTIONAL_STATE_COLORS[state] },
              ]}
            />
            <Text style={styles.legendText}>{EMOTIONAL_STATE_LABELS[state]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 18,
    padding: 20,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.deepStone,
  },
  scrollView: {
    marginHorizontal: -20,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  chartContainer: {
    position: 'relative',
  },
  yAxis: {
    position: 'absolute',
    left: 0,
    top: 10,
    height: 200,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  yAxisLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.mediumStone,
  },
  chart: {
    marginLeft: 80,
    position: 'relative',
    backgroundColor: Colors.warmPaper,
    borderRadius: 12,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.softAsh,
  },
  lineSegment: {
    position: 'absolute',
    height: 2,
    opacity: 0.5,
  },
  dataPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.pureWhite,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  xAxis: {
    marginLeft: 80,
    height: 30,
    position: 'relative',
    marginTop: 10,
  },
  xAxisLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.mediumStone,
    position: 'absolute',
    width: 40,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.deepStone,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.mediumStone,
  },
});

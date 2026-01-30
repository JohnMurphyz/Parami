import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { ParamiScore } from '../../types';
import { getParamiById } from '../../services/firebaseContentService';
import { Colors } from '../../constants/Colors';

interface QuizRadarChartProps {
  scores: ParamiScore[]; // All 10 scores
  size?: number; // Chart size (default: 300)
}

export default function QuizRadarChart({ scores, size = 300 }: QuizRadarChartProps) {
  const center = size / 2;
  const maxRadius = (size / 2) * 0.7; // Leave space for labels
  const levels = 5; // Number of concentric circles (0, 25, 50, 75, 100)

  // Calculate vertex position for a given angle and value (0-100)
  const getVertex = (index: number, value: number) => {
    const angle = (index / 10) * Math.PI * 2 - Math.PI / 2; // Start from top, rotate clockwise
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Get label position (further out from the chart)
  const getLabelPosition = (index: number) => {
    const angle = (index / 10) * Math.PI * 2 - Math.PI / 2;
    const labelRadius = maxRadius + 30;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
    };
  };

  // Generate points string for polygon
  const getPolygonPoints = (valueAtEachVertex: number[]) => {
    return valueAtEachVertex
      .map((value, index) => {
        const vertex = getVertex(index, value);
        return `${vertex.x},${vertex.y}`;
      })
      .join(' ');
  };

  // Grid levels (concentric circles)
  const gridLevels = Array.from({ length: levels }, (_, i) => {
    const value = ((i + 1) / levels) * 100;
    const radius = (value / 100) * maxRadius;
    return { value, radius };
  });

  // Axis lines (from center to each vertex)
  const axisLines = Array.from({ length: 10 }, (_, index) => {
    const vertex = getVertex(index, 100);
    return { index, vertex };
  });

  // Sort scores by parami ID to ensure correct order
  const sortedScores = [...scores].sort((a, b) => a.paramiId - b.paramiId);

  // Get values for the data polygon
  const scoreValues = sortedScores.map((score) => score.normalizedScore);

  // Get background grid polygon (perfect 100)
  const maxPolygonPoints = getPolygonPoints(Array(10).fill(100));

  // Get data polygon
  const dataPolygonPoints = getPolygonPoints(scoreValues);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Grid circles */}
        {gridLevels.map((level, index) => (
          <Circle
            key={index}
            cx={center}
            cy={center}
            r={level.radius}
            stroke={Colors.softAsh}
            strokeWidth="1"
            fill="none"
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((axis) => (
          <Line
            key={axis.index}
            x1={center}
            y1={center}
            x2={axis.vertex.x}
            y2={axis.vertex.y}
            stroke={Colors.softAsh}
            strokeWidth="1"
          />
        ))}

        {/* Data polygon (filled area) */}
        <Polygon
          points={dataPolygonPoints}
          fill={Colors.lotusPink40}
          stroke={Colors.saffronGold}
          strokeWidth="2"
        />

        {/* Center dot */}
        <Circle cx={center} cy={center} r="3" fill={Colors.saffronGold} />

        {/* Labels */}
        {sortedScores.map((score, index) => {
          const parami = getParamiById(score.paramiId);
          if (!parami) return null;

          const labelPos = getLabelPosition(index);
          const name = parami.name; // Use Pali name for compact display

          return (
            <SvgText
              key={index}
              x={labelPos.x}
              y={labelPos.y}
              fontSize="11"
              fill={Colors.deepStone}
              fontWeight="600"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {name}
            </SvgText>
          );
        })}
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.deepMoss }]} />
          <Text style={styles.legendText}>70-100 Strong</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.saffronGold }]} />
          <Text style={styles.legendText}>50-69 Moderate</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.lotusPink }]} />
          <Text style={styles.legendText}>0-49 Developing</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: Colors.mediumStone,
    fontWeight: '500',
  },
});

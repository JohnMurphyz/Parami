import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

interface SectionContainerProps {
  title: string;
  subtitle: string;
  icon?: keyof typeof Ionicons.glyphMap;
  children: ReactNode;
}

export default function SectionContainer({
  title,
  subtitle,
  icon,
  children,
}: SectionContainerProps) {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={32} color={Colors.saffronGold} />
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Guiding Subtitle */}
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Section Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 24,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.saffronGold08,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.deepCharcoal,
    flex: 1,
    fontSize: 24,
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: Colors.deepStone,
    marginBottom: 24,
    lineHeight: 24,
  },
  content: {
    gap: 20,
  },
});

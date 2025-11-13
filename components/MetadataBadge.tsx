import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface MetadataBadgeProps {
  text: string;
  variant?: 'default' | 'accent';
}

export default function MetadataBadge({ text, variant = 'default' }: MetadataBadgeProps) {
  return (
    <View style={[styles.badge, variant === 'accent' && styles.badgeAccent]}>
      <Text style={[styles.badgeText, variant === 'accent' && styles.badgeTextAccent]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.deepCharcoal08,
  },
  badgeAccent: {
    backgroundColor: Colors.saffronGold08,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.mediumStone,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badgeTextAccent: {
    color: Colors.saffronGold,
    fontWeight: '600',
  },
});

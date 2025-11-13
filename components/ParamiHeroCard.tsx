import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import ParamiIcon from './ParamiIcon';

interface ParamiHeroCardProps {
  paramiId: number;
  paramiName: string;
  englishName: string;
  shortDescription: string;
  currentIndex: number;
  totalCount: number;
}

export default function ParamiHeroCard({
  paramiId,
  paramiName,
  englishName,
  shortDescription,
  currentIndex,
  totalCount,
}: ParamiHeroCardProps) {
  return (
    <View style={styles.card}>
      {/* Hero Icon */}
      <View style={styles.iconContainer}>
        <ParamiIcon paramiId={paramiId} size={200} />
      </View>

      {/* Parami Names */}
      <View style={styles.nameContainer}>
        <Text style={styles.paramiName}>{paramiName}</Text>
        <Text style={styles.englishName}>{englishName}</Text>
      </View>

      {/* Short Description */}
      <Text style={styles.shortDescription}>{shortDescription}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 20,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    position: 'relative',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  paramiName: {
    ...Typography.paramiName,
    color: Colors.deepCharcoal,
    textAlign: 'center',
    marginBottom: 8,
  },
  englishName: {
    ...Typography.englishName,
    textAlign: 'center',
  },
  shortDescription: {
    ...Typography.bodyLarge,
    color: Colors.deepStone,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
  },
});

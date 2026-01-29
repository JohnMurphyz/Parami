import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import ParamiIcon from './ParamiIcon';

interface ParamiHeroCardProps {
  paramiId: number;
  paramiName: string;
  englishName: string;
  shortDescription: string;
  fullDescription: string;
  currentIndex: number;
  totalCount: number;
  onFlip?: (isFlipped: boolean) => void;
}

export default function ParamiHeroCard({
  paramiId,
  paramiName,
  englishName,
  shortDescription,
  fullDescription,
  currentIndex,
  totalCount,
  onFlip,
}: ParamiHeroCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset flip state when practice changes
    setIsFlipped(false);
    flipAnimation.setValue(0);
  }, [paramiId]);

  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 1;

    Animated.timing(flipAnimation, {
      toValue,
      duration: 600,
      useNativeDriver: true,
    }).start();

    setIsFlipped(!isFlipped);
    onFlip?.(!isFlipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleFlip}
      style={styles.cardContainer}
      accessibilityLabel={isFlipped ? `${englishName} - Understanding. Double tap to flip back` : `${englishName} - ${paramiName}. Double tap to learn more`}
      accessibilityHint={isFlipped ? "Shows the full understanding of this Parami" : "Tap to flip the card and see the full understanding"}
      accessibilityRole="button"
    >
      {/* Front of Card */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: frontOpacity,
            transform: [{ rotateY: frontInterpolate }],
          },
        ]}
      >
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

        {/* Flip Indicator */}
        <View style={styles.flipIndicator}>
          <Text style={styles.flipIndicatorText}>Tap to learn more</Text>
        </View>
      </Animated.View>

      {/* Back of Card */}
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          {
            opacity: backOpacity,
            transform: [{ rotateY: backInterpolate }],
          },
        ]}
      >
        <View style={styles.backContent}>
          <Text style={styles.backTitle}>Understanding {paramiName}</Text>
          <Text style={styles.fullDescription}>{fullDescription}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    position: 'relative',
  },
  card: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 22,
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 32,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
  flipIndicator: {
    marginTop: 24,
    alignItems: 'center',
  },
  flipIndicatorText: {
    ...Typography.caption,
    color: Colors.mediumStone,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  backContent: {
    paddingVertical: 40,
    minHeight: 344, // Match the front card height (icon container + names + description)
    justifyContent: 'center',
  },
  backTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  fullDescription: {
    ...Typography.bodyLarge,
    color: Colors.deepStone,
    lineHeight: 26,
    textAlign: 'left',
    fontWeight: '400',
  },
});

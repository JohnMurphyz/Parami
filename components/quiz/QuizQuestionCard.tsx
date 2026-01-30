import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { QuizQuestion } from '../../types';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  strengthRating: number | null;
  weaknessRating: number | null;
  onStrengthRating: (rating: number) => void;
  onWeaknessRating: (rating: number) => void;
}

const RATING_LABELS = {
  1: 'Not at all',
  2: 'Slightly',
  3: 'Moderately',
  4: 'Quite a bit',
  5: 'Very much so',
};

export default function QuizQuestionCard({
  question,
  strengthRating,
  weaknessRating,
  onStrengthRating,
  onWeaknessRating,
}: QuizQuestionCardProps) {
  const renderRatingScale = (
    label: string,
    selectedRating: number | null,
    onRating: (rating: number) => void,
    type: 'strength' | 'weakness'
  ) => {
    return (
      <View style={styles.ratingSection}>
        <Text style={styles.ratingLabel}>{label}</Text>
        <View style={styles.ratingButtons}>
          {[1, 2, 3, 4, 5].map((rating) => {
            const isSelected = rating === selectedRating;
            return (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingButton,
                  isSelected && styles.ratingButtonSelected,
                ]}
                onPress={() => onRating(rating)}
                activeOpacity={0.7}
                accessibilityLabel={`Rate ${rating} out of 5: ${RATING_LABELS[rating]}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.ratingButtonText,
                    isSelected && styles.ratingButtonTextSelected,
                  ]}
                >
                  {rating}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.ratingHints}>
          <Text style={styles.ratingHintText}>{RATING_LABELS[1]}</Text>
          <Text style={styles.ratingHintText}>{RATING_LABELS[5]}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      {/* Parami Header */}
      <View style={styles.header}>
        <Text style={styles.paramiName}>{question.paramiName}</Text>
        <Text style={styles.englishName}>{question.englishName}</Text>
      </View>

      {/* Strength Statement */}
      <View style={styles.statementSection}>
        <View style={styles.statementHeader}>
          <View style={styles.strengthIndicator} />
          <Text style={styles.statementLabel}>Strength</Text>
        </View>
        <Text style={styles.statementText}>{question.strengthStatement}</Text>
        {renderRatingScale(
          'How much does this describe you?',
          strengthRating,
          onStrengthRating,
          'strength'
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Weakness Statement */}
      <View style={styles.statementSection}>
        <View style={styles.statementHeader}>
          <View style={styles.weaknessIndicator} />
          <Text style={styles.statementLabel}>Area to Develop</Text>
        </View>
        <Text style={styles.statementText}>{question.weaknessStatement}</Text>
        {renderRatingScale(
          'How much does this describe you?',
          weaknessRating,
          onWeaknessRating,
          'weakness'
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.saffronGold40,
  },
  paramiName: {
    ...Typography.h1,
    fontSize: 28,
    color: Colors.saffronGold,
    marginBottom: 4,
  },
  englishName: {
    ...Typography.h2,
    color: Colors.deepStone,
  },
  statementSection: {
    marginBottom: 8,
  },
  statementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  strengthIndicator: {
    width: 3,
    height: 16,
    backgroundColor: Colors.deepMoss,
    borderRadius: 2,
  },
  weaknessIndicator: {
    width: 3,
    height: 16,
    backgroundColor: Colors.lotusPink,
    borderRadius: 2,
  },
  statementLabel: {
    ...Typography.caption,
    color: Colors.mediumStone,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statementText: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    lineHeight: 22,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.softAsh,
    marginVertical: 20,
  },
  ratingSection: {
    marginTop: 12,
  },
  ratingLabel: {
    ...Typography.caption,
    color: Colors.deepStone,
    marginBottom: 12,
    fontWeight: '500',
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.mediumStone,
    backgroundColor: Colors.pureWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingButtonSelected: {
    borderColor: Colors.saffronGold,
    backgroundColor: Colors.saffronGold,
  },
  ratingButtonText: {
    ...Typography.h2,
    color: Colors.mediumStone,
    fontWeight: '600',
  },
  ratingButtonTextSelected: {
    color: Colors.pureWhite,
  },
  ratingHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  ratingHintText: {
    ...Typography.caption,
    color: Colors.mediumStone,
    fontSize: 11,
  },
});

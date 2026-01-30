import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { QuizResponse } from '../types';
import { saveQuizResult } from '../services/storageService';
import QuizProgressBar from '../components/quiz/QuizProgressBar';
import QuizQuestionCard from '../components/quiz/QuizQuestionCard';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, QuizResponse>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const currentResponse = responses[currentQuestion.id];
  const totalQuestions = QUIZ_QUESTIONS.length;

  // Check if current question is answered (both ratings provided)
  const isCurrentQuestionAnswered =
    currentResponse &&
    currentResponse.strengthRating > 0 &&
    currentResponse.weaknessRating > 0;

  // Check if all questions are answered
  const areAllQuestionsAnswered =
    Object.keys(responses).length === totalQuestions &&
    Object.values(responses).every(
      (r) => r.strengthRating > 0 && r.weaknessRating > 0
    );

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleStrengthRating = (rating: number) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        paramiId: currentQuestion.id,
        strengthRating: rating,
        weaknessRating: prev[currentQuestion.id]?.weaknessRating || 0,
      },
    }));
  };

  const handleWeaknessRating = (rating: number) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        paramiId: currentQuestion.id,
        strengthRating: prev[currentQuestion.id]?.strengthRating || 0,
        weaknessRating: rating,
      },
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!areAllQuestionsAnswered) {
      Alert.alert(
        'Incomplete Quiz',
        'Please answer all questions before submitting.'
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert responses object to array
      const responsesArray = Object.values(responses);

      // Save quiz result
      const result = await saveQuizResult(responsesArray);

      // Navigate to results screen
      router.replace(`/quiz-results/${result.id}`);
    } catch (error) {
      console.error('Error saving quiz:', error);
      Alert.alert(
        'Error',
        'Failed to save quiz results. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Quiz?',
      'Your progress will be lost. Are you sure you want to exit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            // Check if we can go back, otherwise go to journey tab
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/journey');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Exit Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.exitButton}
          onPress={handleExit}
          activeOpacity={0.7}
          accessibilityLabel="Exit quiz"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={24} color={Colors.deepCharcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>The Crossing Over Diagnostic</Text>
        <View style={styles.exitButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <QuizProgressBar
          current={currentQuestionIndex + 1}
          total={totalQuestions}
        />

        {/* Question Card */}
        <QuizQuestionCard
          question={currentQuestion}
          strengthRating={currentResponse?.strengthRating || null}
          weaknessRating={currentResponse?.weaknessRating || null}
          onStrengthRating={handleStrengthRating}
          onWeaknessRating={handleWeaknessRating}
        />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.backButton,
            isFirstQuestion && styles.navButtonDisabled,
          ]}
          onPress={handleBack}
          disabled={isFirstQuestion}
          activeOpacity={0.7}
          accessibilityLabel="Previous question"
          accessibilityRole="button"
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={isFirstQuestion ? Colors.mediumStone : Colors.deepCharcoal}
          />
          <Text
            style={[
              styles.navButtonText,
              isFirstQuestion && styles.navButtonTextDisabled,
            ]}
          >
            Back
          </Text>
        </TouchableOpacity>

        {isLastQuestion ? (
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.submitButton,
              !areAllQuestionsAnswered && styles.navButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!areAllQuestionsAnswered || isSubmitting}
            activeOpacity={0.7}
            accessibilityLabel="Submit quiz"
            accessibilityRole="button"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={Colors.pureWhite} />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit</Text>
                <Ionicons name="checkmark" size={20} color={Colors.pureWhite} />
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              !isCurrentQuestionAnswered && styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!isCurrentQuestionAnswered}
            activeOpacity={0.7}
            accessibilityLabel="Next question"
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.navButtonText,
                !isCurrentQuestionAnswered && styles.navButtonTextDisabled,
              ]}
            >
              Next
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={
                isCurrentQuestionAnswered
                  ? Colors.deepCharcoal
                  : Colors.mediumStone
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmStone,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.warmStone,
  },
  exitButton: {
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
  headerTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: Colors.warmStone,
    borderTopWidth: 1,
    borderTopColor: Colors.softAsh,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 120,
  },
  backButton: {
    backgroundColor: Colors.pureWhite,
    borderWidth: 1,
    borderColor: Colors.softAsh,
  },
  nextButton: {
    backgroundColor: Colors.pureWhite,
    borderWidth: 1,
    borderColor: Colors.saffronGold,
  },
  submitButton: {
    backgroundColor: Colors.saffronGold,
    flex: 1,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: Colors.mediumStone,
  },
  submitButtonText: {
    ...Typography.body,
    color: Colors.pureWhite,
    fontWeight: '600',
  },
});

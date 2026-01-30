import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SimplifiedReflection, createEmptySimplifiedReflection } from '../types/simplifiedReflection';
import {
  getTodaySimplifiedReflection,
  saveSimplifiedReflection,
} from '../services/storageService';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { logger } from '../utils/logger';

// Section Components
import MindIntentionSection from './MindIntentionSection';
import ExperienceResponseSection from './ExperienceResponseSection';
import ReflectionIntegrationSection from './ReflectionIntegrationSection';

interface SimplifiedReflectionModalProps {
  visible: boolean;
  paramiId: number;
  onClose: () => void;
  onComplete?: (reflection: SimplifiedReflection) => void;
}

type SectionKey = 'mindIntention' | 'experienceResponse' | 'reflectionIntegration';

interface SectionConfig {
  key: SectionKey;
  title: string;
  subtitle: string;
  completionKey: keyof SimplifiedReflection['completedSections'];
}

const SECTIONS: SectionConfig[] = [
  {
    key: 'mindIntention',
    title: 'Mind & Intention',
    subtitle: 'Track mental states and patterns',
    completionKey: 'mindIntention',
  },
  {
    key: 'experienceResponse',
    title: 'Experience & Response',
    subtitle: 'Life conditions and responses',
    completionKey: 'experienceResponse',
  },
  {
    key: 'reflectionIntegration',
    title: 'Reflection & Integration',
    subtitle: 'Synthesize and integrate',
    completionKey: 'reflectionIntegration',
  },
];

export default function SimplifiedReflectionModal({
  visible,
  paramiId,
  onClose,
  onComplete,
}: SimplifiedReflectionModalProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [reflection, setReflection] = useState<SimplifiedReflection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Load or create reflection when modal opens
  useEffect(() => {
    if (visible) {
      loadReflection();
    }
  }, [visible, paramiId]);

  const loadReflection = async () => {
    try {
      setIsLoading(true);
      const data = await getTodaySimplifiedReflection(paramiId);
      setReflection(data);
    } catch (error) {
      logger.error('Error loading reflection', error);
      Alert.alert('Error', 'Failed to load reflection data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveReflection = async (updatedReflection: SimplifiedReflection) => {
    try {
      setIsSaving(true);
      await saveSimplifiedReflection(updatedReflection);
      logger.info('Reflection auto-saved successfully', {
        id: updatedReflection.id,
        section: SECTIONS[currentSectionIndex].key,
      });
    } catch (error) {
      logger.error('Error auto-saving reflection', error);
      // Silent fail for auto-save - don't interrupt user
    } finally {
      setIsSaving(false);
    }
  };

  const handleSectionComplete = async () => {
    if (!reflection) return;

    // Mark current section as completed
    const currentSection = SECTIONS[currentSectionIndex];
    const updatedReflection = {
      ...reflection,
      completedSections: {
        ...reflection.completedSections,
        [currentSection.completionKey]: true,
      },
    };

    // Auto-save
    setReflection(updatedReflection);
    await saveReflection(updatedReflection);
  };

  const animateToNextSection = (nextIndex: number) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Change section
      setCurrentSectionIndex(nextIndex);
      // Scroll to top
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = async () => {
    await handleSectionComplete();

    if (currentSectionIndex < SECTIONS.length - 1) {
      animateToNextSection(currentSectionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      animateToNextSection(currentSectionIndex - 1);
    }
  };

  const handleClose = () => {
    if (!reflection) {
      onClose();
      return;
    }

    // Check if any work has been done
    const hasWork =
      reflection.mindIntention ||
      reflection.experienceResponse ||
      reflection.reflectionIntegration?.overallReflection;

    if (hasWork) {
      Alert.alert(
        'Save Progress?',
        'You have unsaved work. Would you like to save your progress before closing?',
        [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setCurrentSectionIndex(0);
              onClose();
            },
          },
          {
            text: 'Save & Close',
            onPress: async () => {
              await saveReflection(reflection);
              setCurrentSectionIndex(0);
              onClose();
            },
          },
        ]
      );
    } else {
      setCurrentSectionIndex(0);
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!reflection) return;

    // Validate that overall reflection has content
    if (!reflection.reflectionIntegration?.overallReflection?.trim()) {
      Alert.alert(
        'Reflection Required',
        'Please complete the overall reflection before submitting.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsSaving(true);
      // Save reflection to storage
      const finalReflection = await saveSimplifiedReflection(reflection);
      logger.info('Reflection submitted successfully', { id: finalReflection.id });

      Alert.alert(
        'Reflection Complete',
        'Your reflection has been saved. May your practice continue to deepen.',
        [
          {
            text: 'Done',
            onPress: () => {
              setCurrentSectionIndex(0);
              onComplete?.(finalReflection);
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      logger.error('Error submitting reflection', error);
      Alert.alert(
        'Save Failed',
        'There was a problem saving your reflection. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderCurrentSection = () => {
    if (!reflection) return null;

    const currentSection = SECTIONS[currentSectionIndex];

    switch (currentSection.key) {
      case 'mindIntention':
        return (
          <MindIntentionSection
            data={
              reflection.mindIntention || {
                lordsOfMaterialism: {
                  lordOfForm: false,
                  lordOfSpeech: false,
                  lordOfMind: false,
                },
                patternsNoticed: '',
                wholesomeSeeds: [],
                unwholesomeSeeds: [],
                patternResponse: '',
              }
            }
            onChange={(data) =>
              setReflection({ ...reflection, mindIntention: data })
            }
          />
        );

      case 'experienceResponse':
        return (
          <ExperienceResponseSection
            data={
              reflection.experienceResponse || {
                lifeExperiences: {
                  selected: [],
                  description: '',
                },
                secondArrow: {
                  occurred: false,
                  description: '',
                },
                hardGroundReflection: '',
                mentalConsumption: '',
              }
            }
            onChange={(data) =>
              setReflection({ ...reflection, experienceResponse: data })
            }
          />
        );

      case 'reflectionIntegration':
        return (
          <ReflectionIntegrationSection
            data={reflection.reflectionIntegration}
            onChange={(data) =>
              setReflection({ ...reflection, reflectionIntegration: data })
            }
          />
        );

      default:
        return null;
    }
  };

  const currentSection = SECTIONS[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / SECTIONS.length) * 100;
  const isLastSection = currentSectionIndex === SECTIONS.length - 1;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            accessibilityLabel="Close reflection"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={28} color={Colors.deepCharcoal} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{currentSection.title}</Text>
            <Text style={styles.headerSubtitle}>
              Section {currentSectionIndex + 1} of {SECTIONS.length}
            </Text>
          </View>

          {isSaving && (
            <View style={styles.savingIndicator}>
              <ActivityIndicator size="small" color={Colors.saffronGold} />
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.saffronGold} />
            <Text style={styles.loadingText}>Loading reflection...</Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              {renderCurrentSection()}
            </Animated.View>
          </ScrollView>
        )}

        {/* Navigation Footer */}
        {!isLoading && (
          <View style={styles.footer}>
            {currentSectionIndex > 0 ? (
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
                accessibilityLabel="Go back"
                accessibilityRole="button"
              >
                <Ionicons name="arrow-back" size={20} color={Colors.deepCharcoal} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.backButton} />
            )}

            <TouchableOpacity
              onPress={isLastSection ? handleSubmit : handleNext}
              style={[
                styles.nextButton,
                isSaving && styles.nextButtonDisabled,
              ]}
              disabled={isSaving}
              accessibilityLabel={isLastSection ? 'Submit reflection' : 'Next section'}
              accessibilityRole="button"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={Colors.pureWhite} />
              ) : (
                <>
                  <Text style={styles.nextButtonText}>
                    {isLastSection ? 'Submit' : 'Next'}
                  </Text>
                  {!isLastSection && (
                    <Ionicons name="arrow-forward" size={20} color={Colors.pureWhite} />
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmPaper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.pureWhite,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.deepStone,
    marginTop: 2,
  },
  savingIndicator: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.softAsh,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.saffronGold,
    borderRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.deepStone,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.pureWhite,
    borderTopWidth: 1,
    borderTopColor: Colors.softAsh,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 100,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.saffronGold,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 120,
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    ...Typography.body,
    color: Colors.pureWhite,
    fontWeight: '700',
  },
});

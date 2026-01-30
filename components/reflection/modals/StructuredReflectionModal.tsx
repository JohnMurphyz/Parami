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
import { StructuredReflection } from '../../../types';
import {
  getTodayReflection,
  saveStructuredReflection,
} from '../../../services/storageService';
import { Colors } from '../../../constants/Colors';
import { Typography } from '../../../constants/Typography';
import { logger } from '../../../utils/logger';

// Section Components
import EgoAuditSection from '../sections/structured/EgoAuditSection';
import GardenLogSection from '../sections/structured/GardenLogSection';
import NutrimentAuditSection from '../sections/structured/NutrimentAuditSection';
import VicissitudesSection from '../sections/structured/VicissitudesSection';
import DisappointmentSection from '../sections/structured/DisappointmentSection';
import DailyPromptsSection from '../sections/structured/DailyPromptsSection';
import ReflectionSummarySection from '../sections/structured/ReflectionSummarySection';

interface StructuredReflectionModalProps {
  visible: boolean;
  paramiId: number;
  onClose: () => void;
  onComplete?: (reflection: StructuredReflection) => void;
}

type SectionKey = 'egoAudit' | 'gardenLog' | 'nutrimentAudit' | 'vicissitudes' | 'disappointment' | 'dailyPrompts' | 'summary';

interface SectionConfig {
  key: SectionKey;
  title: string;
  completionKey?: keyof StructuredReflection['completedSections'];
}

const SECTIONS: SectionConfig[] = [
  { key: 'egoAudit', title: 'The Ego Audit', completionKey: 'egoAudit' },
  { key: 'gardenLog', title: 'The Garden Log', completionKey: 'gardenLog' },
  { key: 'nutrimentAudit', title: 'The Nutriment Audit', completionKey: 'nutrimentAudit' },
  { key: 'vicissitudes', title: 'The Vicissitudes of Life', completionKey: 'vicissitudes' },
  { key: 'disappointment', title: 'The Chariot of Disappointment', completionKey: 'disappointment' },
  { key: 'dailyPrompts', title: 'Daily Contemplations' },
  { key: 'summary', title: 'Reflection Summary' },
];

export default function StructuredReflectionModal({
  visible,
  paramiId,
  onClose,
  onComplete,
}: StructuredReflectionModalProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [reflection, setReflection] = useState<StructuredReflection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Load reflection when modal opens
  useEffect(() => {
    if (visible) {
      loadReflection();
    }
  }, [visible, paramiId]);

  const loadReflection = async () => {
    try {
      setIsLoading(true);
      const data = await getTodayReflection(paramiId);
      setReflection(data);
    } catch (error) {
      logger.error('Error loading reflection', error);
      Alert.alert('Error', 'Failed to load reflection data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveReflection = async (updatedReflection: StructuredReflection) => {
    try {
      setIsSaving(true);
      // Update timestamp
      const reflectionToSave = {
        ...updatedReflection,
        updatedAt: new Date().toISOString(),
      };
      await saveStructuredReflection(reflectionToSave);
      logger.info('Reflection auto-saved successfully');
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
    let updatedReflection = { ...reflection };

    if (currentSection.completionKey) {
      updatedReflection = {
        ...updatedReflection,
        completedSections: {
          ...updatedReflection.completedSections,
          [currentSection.completionKey]: true,
        },
      };
    }

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
    } else {
      // Final submission
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      animateToNextSection(currentSectionIndex - 1);
    }
  };

  const handleClose = () => {
    Alert.alert(
      'Save Progress?',
      'Your reflection will be saved automatically. You can resume it later.',
      [
        {
          text: 'Continue Editing',
          style: 'cancel',
        },
        {
          text: 'Close',
          onPress: () => {
            setCurrentSectionIndex(0);
            onClose();
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!reflection) return;

    // Validate that at least overall reflection has content
    if (!reflection.overallReflection?.trim()) {
      Alert.alert(
        'Complete Your Reflection',
        'Please add an overall reflection summarizing your day before submitting.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsSaving(true);
      // Update reflection with current timestamp
      const finalReflection = {
        ...reflection,
        updatedAt: new Date().toISOString(),
      };
      await saveStructuredReflection(finalReflection);

      Alert.alert(
        'Reflection Complete',
        'Your deep reflection has been saved. May your practice continue to deepen.',
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
      case 'egoAudit':
        return (
          <EgoAuditSection
            data={
              reflection.egoAudit || {
                lordsOfMaterialism: {
                  lordOfForm: false,
                  lordOfSpeech: false,
                  lordOfMind: false,
                  notes: '',
                },
                spiritualAdvisor: '',
                areYouSure: '',
              }
            }
            onChange={(data) =>
              setReflection({ ...reflection, egoAudit: data })
            }
          />
        );

      case 'gardenLog':
        return (
          <GardenLogSection
            data={
              reflection.gardenLog || {
                wholesomeSeeds: [],
                unwholesomeSeeds: [],
                changingThePeg: '',
                helloHabitEnergy: '',
              }
            }
            onChange={(data) =>
              setReflection({ ...reflection, gardenLog: data })
            }
          />
        );

      case 'nutrimentAudit':
        return (
          <NutrimentAuditSection
            data={
              reflection.nutrimentAudit || {
                edibleFood: { wasMindful: false, notes: '' },
                senseImpressions: { toxicMedia: [], impact: '' },
                intention: { deepDesire: '', selfOrOthers: 'self' },
                collectiveEnergy: '',
              }
            }
            onChange={(data) =>
              setReflection({ ...reflection, nutrimentAudit: data })
            }
          />
        );

      case 'vicissitudes':
        return (
          <VicissitudesSection
            data={
              reflection.vicissitudes || {
                worldlyConditions: {},
                secondArrow: { occurred: false, description: '' },
              }
            }
            onChange={(data) =>
              setReflection({ ...reflection, vicissitudes: data })
            }
          />
        );

      case 'disappointment':
        return (
          <DisappointmentSection
            data={
              reflection.disappointment || {
                practiceFeltTedious: false,
                hardGroundMoments: '',
                softLandingAttempts: '',
              }
            }
            onChange={(data) =>
              setReflection({ ...reflection, disappointment: data })
            }
          />
        );

      case 'dailyPrompts':
        return (
          <DailyPromptsSection
            data={reflection.dailyPrompts}
            onChange={(data) =>
              setReflection({ ...reflection, dailyPrompts: data })
            }
          />
        );

      case 'summary':
        return (
          <ReflectionSummarySection
            emotionalState={reflection.emotionalState}
            resilienceLevel={reflection.resilienceLevel}
            overallReflection={reflection.overallReflection}
            onEmotionalStateChange={(state) =>
              setReflection({ ...reflection, emotionalState: state })
            }
            onResilienceLevelChange={(level) =>
              setReflection({ ...reflection, resilienceLevel: level })
            }
            onOverallReflectionChange={(text) =>
              setReflection({ ...reflection, overallReflection: text })
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
      presentationStyle="fullScreen"
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
            <Text style={styles.headerTitle}>Deep Reflection</Text>
            <Text style={styles.headerSubtitle}>
              Section {currentSectionIndex + 1} of {SECTIONS.length}: {currentSection.title}
            </Text>
          </View>

          {isSaving && (
            <ActivityIndicator size="small" color={Colors.saffronGold} />
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
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
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              {renderCurrentSection()}
            </Animated.View>
          </ScrollView>
        )}

        {/* Navigation Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.footerButton, styles.backButton]}
            disabled={currentSectionIndex === 0}
            accessibilityLabel="Previous section"
            accessibilityRole="button"
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={currentSectionIndex === 0 ? Colors.mediumStone : Colors.deepCharcoal}
            />
            <Text
              style={[
                styles.footerButtonText,
                currentSectionIndex === 0 && styles.footerButtonTextDisabled,
              ]}
            >
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            style={[styles.footerButton, styles.nextButton]}
            disabled={isSaving}
            accessibilityLabel={isLastSection ? 'Submit reflection' : 'Next section'}
            accessibilityRole="button"
          >
            <Text style={styles.nextButtonText}>
              {isLastSection ? 'Submit Reflection' : 'Next'}
            </Text>
            {!isLastSection && (
              <Ionicons name="arrow-forward" size={20} color={Colors.pureWhite} />
            )}
          </TouchableOpacity>
        </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softAsh,
    gap: 12,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    fontSize: 20,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.deepStone,
    marginTop: 2,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softAsh,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.softAsh,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.saffronGold,
    borderRadius: 3,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.deepStone,
    marginTop: 6,
    textAlign: 'center',
    fontSize: 11,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.deepStone,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: Colors.pureWhite,
    borderTopWidth: 1,
    borderTopColor: Colors.softAsh,
    gap: 12,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    minWidth: 100,
  },
  backButton: {
    backgroundColor: Colors.warmStone,
  },
  footerButtonText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.deepCharcoal,
  },
  footerButtonTextDisabled: {
    color: Colors.mediumStone,
  },
  nextButton: {
    flex: 1,
    backgroundColor: Colors.saffronGold,
  },
  nextButtonText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.pureWhite,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StructuredReflection, EmotionalState, ResilienceLevel } from '../types';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface StructuredEntryDetailModalProps {
  visible: boolean;
  entry: StructuredReflection | null;
  paramiName: string;
  onClose: () => void;
}

type SectionKey = 'egoAudit' | 'gardenLog' | 'nutrimentAudit' | 'vicissitudes' | 'disappointment';

const EMOTIONAL_STATE_LABELS: Record<EmotionalState, string> = {
  peaceful: 'Peaceful',
  grateful: 'Grateful',
  challenged: 'Challenged',
  restless: 'Restless',
  discouraged: 'Discouraged',
};

const RESILIENCE_LABELS: Record<ResilienceLevel, string> = {
  stable: 'Stable',
  wavering: 'Wavering',
  struggling: 'Struggling',
};

export default function StructuredEntryDetailModal({
  visible,
  entry,
  paramiName,
  onClose,
}: StructuredEntryDetailModalProps) {
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(new Set());

  if (!entry) return null;

  const toggleSection = (section: SectionKey) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const date = new Date(entry.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={28} color={Colors.deepCharcoal} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Deep Reflection</Text>
            <Text style={styles.headerSubtitle}>{formattedDate}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
        >
          {/* Parami & Emotional State */}
          <View style={styles.summaryCard}>
            <Text style={styles.paramiLabel}>{paramiName}</Text>
            <View style={styles.emotionalRow}>
              <View style={styles.emotionalItem}>
                <Text style={styles.emotionalLabel}>Emotional State</Text>
                <Text style={styles.emotionalValue}>
                  {EMOTIONAL_STATE_LABELS[entry.emotionalState]}
                </Text>
              </View>
              <View style={styles.emotionalItem}>
                <Text style={styles.emotionalLabel}>Resilience</Text>
                <Text style={styles.emotionalValue}>
                  {RESILIENCE_LABELS[entry.resilienceLevel]}
                </Text>
              </View>
            </View>
          </View>

          {/* Overall Reflection */}
          {entry.overallReflection && (
            <View style={styles.overallReflectionCard}>
              <Text style={styles.overallReflectionTitle}>Overall Reflection</Text>
              <Text style={styles.overallReflectionText}>{entry.overallReflection}</Text>
            </View>
          )}

          {/* Section 1: Ego Audit */}
          {entry.egoAudit && (
            <AccordionSection
              title="The Ego Audit"
              icon="eye-outline"
              isExpanded={expandedSections.has('egoAudit')}
              onToggle={() => toggleSection('egoAudit')}
            >
              <View style={styles.sectionContent}>
                <DetailItem label="Lords of Materialism">
                  {entry.egoAudit.lordsOfMaterialism.lordOfForm && (
                    <CheckedItem text="Lord of Form (Seeking comfort)" />
                  )}
                  {entry.egoAudit.lordsOfMaterialism.lordOfSpeech && (
                    <CheckedItem text="Lord of Speech (Intellect as shield)" />
                  )}
                  {entry.egoAudit.lordsOfMaterialism.lordOfMind && (
                    <CheckedItem text="Lord of Mind (Spiritual superiority)" />
                  )}
                  {entry.egoAudit.lordsOfMaterialism.notes && (
                    <Text style={styles.noteText}>{entry.egoAudit.lordsOfMaterialism.notes}</Text>
                  )}
                </DetailItem>

                {entry.egoAudit.spiritualAdvisor && (
                  <DetailItem label="Spiritual Advisor (Rationalizations)">
                    <Text style={styles.responseText}>{entry.egoAudit.spiritualAdvisor}</Text>
                  </DetailItem>
                )}

                {entry.egoAudit.areYouSure && (
                  <DetailItem label="Are You Sure? (Perception Challenges)">
                    <Text style={styles.responseText}>{entry.egoAudit.areYouSure}</Text>
                  </DetailItem>
                )}
              </View>
            </AccordionSection>
          )}

          {/* Section 2: Garden Log */}
          {entry.gardenLog && (
            <AccordionSection
              title="The Garden Log"
              icon="leaf-outline"
              isExpanded={expandedSections.has('gardenLog')}
              onToggle={() => toggleSection('gardenLog')}
            >
              <View style={styles.sectionContent}>
                {entry.gardenLog.wholesomeSeeds.length > 0 && (
                  <DetailItem label="Wholesome Seeds Watered">
                    <View style={styles.chipList}>
                      {entry.gardenLog.wholesomeSeeds.map((seed, index) => (
                        <View key={index} style={[styles.chip, styles.chipWholesome]}>
                          <Text style={styles.chipText}>{seed}</Text>
                        </View>
                      ))}
                    </View>
                  </DetailItem>
                )}

                {entry.gardenLog.unwholesomeSeeds.length > 0 && (
                  <DetailItem label="Unwholesome Seeds Watered">
                    <View style={styles.chipList}>
                      {entry.gardenLog.unwholesomeSeeds.map((seed, index) => (
                        <View key={index} style={[styles.chip, styles.chipUnwholesome]}>
                          <Text style={styles.chipText}>{seed}</Text>
                        </View>
                      ))}
                    </View>
                  </DetailItem>
                )}

                {entry.gardenLog.changingThePeg && (
                  <DetailItem label="Changing the Peg">
                    <Text style={styles.responseText}>{entry.gardenLog.changingThePeg}</Text>
                  </DetailItem>
                )}

                {entry.gardenLog.helloHabitEnergy && (
                  <DetailItem label="Hello, Habit Energy">
                    <Text style={styles.responseText}>{entry.gardenLog.helloHabitEnergy}</Text>
                  </DetailItem>
                )}
              </View>
            </AccordionSection>
          )}

          {/* Section 3: Nutriment Audit */}
          {entry.nutrimentAudit && (
            <AccordionSection
              title="The Nutriment Audit"
              icon="nutrition-outline"
              isExpanded={expandedSections.has('nutrimentAudit')}
              onToggle={() => toggleSection('nutrimentAudit')}
            >
              <View style={styles.sectionContent}>
                <DetailItem label="Edible Food - Mindful Eating">
                  <Text style={styles.responseText}>
                    {entry.nutrimentAudit.edibleFood.wasMindful
                      ? '✓ Ate mindfully today'
                      : '✗ Did not eat mindfully'}
                  </Text>
                  {entry.nutrimentAudit.edibleFood.notes && (
                    <Text style={styles.noteText}>{entry.nutrimentAudit.edibleFood.notes}</Text>
                  )}
                </DetailItem>

                {entry.nutrimentAudit.senseImpressions.toxicMedia.length > 0 && (
                  <DetailItem label="Sense Impressions - Toxic Content">
                    <Text style={styles.responseText}>
                      {entry.nutrimentAudit.senseImpressions.toxicMedia.join(', ')}
                    </Text>
                    {entry.nutrimentAudit.senseImpressions.impact && (
                      <Text style={styles.noteText}>
                        Impact: {entry.nutrimentAudit.senseImpressions.impact}
                      </Text>
                    )}
                  </DetailItem>
                )}

                {entry.nutrimentAudit.intention.deepDesire && (
                  <DetailItem label="Intention - Deep Desire">
                    <Text style={styles.responseText}>
                      {entry.nutrimentAudit.intention.deepDesire}
                    </Text>
                    <Text style={styles.noteText}>
                      Motivated by: {entry.nutrimentAudit.intention.selfOrOthers}
                    </Text>
                  </DetailItem>
                )}

                {entry.nutrimentAudit.collectiveEnergy && (
                  <DetailItem label="Consciousness - Collective Energy">
                    <Text style={styles.responseText}>{entry.nutrimentAudit.collectiveEnergy}</Text>
                  </DetailItem>
                )}
              </View>
            </AccordionSection>
          )}

          {/* Section 4: Vicissitudes */}
          {entry.vicissitudes && (
            <AccordionSection
              title="The Vicissitudes of Life"
              icon="swap-horizontal-outline"
              isExpanded={expandedSections.has('vicissitudes')}
              onToggle={() => toggleSection('vicissitudes')}
            >
              <View style={styles.sectionContent}>
                {Object.entries(entry.vicissitudes.worldlyConditions).map(([key, value]) => {
                  if (!value?.occurred) return null;
                  return (
                    <DetailItem key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                      <Text style={styles.responseText}>{value.reaction}</Text>
                    </DetailItem>
                  );
                })}

                {entry.vicissitudes.secondArrow.occurred && (
                  <DetailItem label="The Second Arrow">
                    <Text style={styles.responseText}>
                      {entry.vicissitudes.secondArrow.description}
                    </Text>
                  </DetailItem>
                )}
              </View>
            </AccordionSection>
          )}

          {/* Section 5: Disappointment */}
          {entry.disappointment && (
            <AccordionSection
              title="The Chariot of Disappointment"
              icon="trending-down-outline"
              isExpanded={expandedSections.has('disappointment')}
              onToggle={() => toggleSection('disappointment')}
            >
              <View style={styles.sectionContent}>
                <DetailItem label="Practice Felt Tedious">
                  <Text style={styles.responseText}>
                    {entry.disappointment.practiceFeltTedious ? 'Yes' : 'No'}
                  </Text>
                </DetailItem>

                {entry.disappointment.hardGroundMoments && (
                  <DetailItem label="Landing on Hard Ground">
                    <Text style={styles.responseText}>
                      {entry.disappointment.hardGroundMoments}
                    </Text>
                  </DetailItem>
                )}

                {entry.disappointment.softLandingAttempts && (
                  <DetailItem label="Seeking Soft Landing">
                    <Text style={styles.responseText}>
                      {entry.disappointment.softLandingAttempts}
                    </Text>
                  </DetailItem>
                )}
              </View>
            </AccordionSection>
          )}

          {/* Daily Prompts */}
          <View style={styles.dailyPromptsCard}>
            <Text style={styles.dailyPromptsTitle}>Daily Contemplations</Text>

            {entry.dailyPrompts.selfReliance && (
              <DetailItem label="Self-Reliance">
                <Text style={styles.responseText}>{entry.dailyPrompts.selfReliance}</Text>
              </DetailItem>
            )}

            {entry.dailyPrompts.nowness && (
              <DetailItem label="Nowness">
                <Text style={styles.responseText}>{entry.dailyPrompts.nowness}</Text>
              </DetailItem>
            )}

            {entry.dailyPrompts.nonAttachment && (
              <DetailItem label="Non-Attachment">
                <Text style={styles.responseText}>{entry.dailyPrompts.nonAttachment}</Text>
              </DetailItem>
            )}

            {entry.dailyPrompts.clarity && (
              <DetailItem label="Clarity">
                <Text style={styles.responseText}>{entry.dailyPrompts.clarity}</Text>
              </DetailItem>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// Helper Components

interface AccordionSectionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionSection({ title, icon, isExpanded, onToggle, children }: AccordionSectionProps) {
  return (
    <View style={styles.accordionSection}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={styles.accordionHeaderLeft}>
          <Ionicons name={icon} size={24} color={Colors.saffronGold} />
          <Text style={styles.accordionTitle}>{title}</Text>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={Colors.deepStone}
        />
      </TouchableOpacity>

      {isExpanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
}

interface DetailItemProps {
  label: string;
  children: React.ReactNode;
}

function DetailItem({ label, children }: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      {children}
    </View>
  );
}

function CheckedItem({ text }: { text: string }) {
  return (
    <View style={styles.checkedItem}>
      <Ionicons name="checkmark-circle" size={16} color={Colors.saffronGold} />
      <Text style={styles.checkedItemText}>{text}</Text>
    </View>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.saffronGold,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  paramiLabel: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginBottom: 12,
  },
  emotionalRow: {
    flexDirection: 'row',
    gap: 16,
  },
  emotionalItem: {
    flex: 1,
  },
  emotionalLabel: {
    ...Typography.caption,
    color: Colors.deepStone,
    marginBottom: 4,
  },
  emotionalValue: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.deepCharcoal,
  },
  overallReflectionCard: {
    backgroundColor: Colors.saffronGold08,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  overallReflectionTitle: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
    marginBottom: 12,
  },
  overallReflectionText: {
    ...Typography.body,
    color: Colors.deepStone,
    lineHeight: 24,
  },
  accordionSection: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.warmStone,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  accordionTitle: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
  },
  accordionContent: {
    padding: 16,
  },
  sectionContent: {
    gap: 16,
  },
  detailItem: {
    gap: 8,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.deepStone,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  responseText: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    lineHeight: 22,
  },
  noteText: {
    ...Typography.caption,
    color: Colors.deepStone,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 4,
  },
  checkedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  checkedItemText: {
    ...Typography.body,
    color: Colors.deepCharcoal,
  },
  chipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipWholesome: {
    backgroundColor: Colors.deepMoss08,
    borderColor: Colors.deepMoss,
  },
  chipUnwholesome: {
    backgroundColor: Colors.lotusPink12,
    borderColor: Colors.lotusPink,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.deepCharcoal,
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  dailyPromptsCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 20,
    marginTop: 4,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  dailyPromptsTitle: {
    ...Typography.h3,
    color: Colors.deepCharcoal,
    marginBottom: 4,
  },
});

import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getParamiById } from '../services/firebaseContentService';
import { getParamiAdvice } from '../data/paramiAdvice';
import ParamiIcon from './ParamiIcon';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface ParamiDetailModalProps {
  visible: boolean;
  paramiId: number | null;
  score: number; // 0-100
  onClose: () => void;
}

type Stage = 'Recognition' | 'Encouragement' | 'Realization';

export default function ParamiDetailModal({ visible, paramiId, score, onClose }: ParamiDetailModalProps) {
  if (!paramiId) return null;

  const parami = getParamiById(paramiId);
  const advice = getParamiAdvice(paramiId);

  if (!parami || !advice) return null;

  // Calculate stage based on score (0-100)
  const getStage = (): Stage => {
    if (score <= 30) return 'Recognition';
    if (score <= 70) return 'Encouragement';
    return 'Realization';
  };

  const stage = getStage();

  // Get stage color and background
  const getStageColors = () => {
    switch (stage) {
      case 'Recognition':
        return {
          background: Colors.lotusPink16,
          text: Colors.lotusPink,
        };
      case 'Encouragement':
        return {
          background: Colors.saffronGold16,
          text: Colors.saffronGold,
        };
      case 'Realization':
        return {
          background: Colors.deepMoss12,
          text: Colors.deepMoss,
        };
    }
  };

  const stageColors = getStageColors();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header with Close Button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color={Colors.deepCharcoal} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Parami Image and Name */}
          <View style={styles.heroSection}>
            <View style={styles.imageContainer}>
              <ParamiIcon paramiId={paramiId} size={150} />
            </View>
            <Text style={styles.paramiName}>{parami.name}</Text>
            <Text style={styles.englishName}>{parami.englishName}</Text>
          </View>

          {/* Score Badge */}
          <View style={[styles.scoreBadge, { backgroundColor: stageColors.background }]}>
            <Text style={styles.scoreTitle}>Your Score</Text>
            <Text style={[styles.scoreNumber, { color: stageColors.text }]}>
              {score}/100
            </Text>
            <View style={[styles.stageBadge, { backgroundColor: stageColors.text }]}>
              <Text style={styles.stageText}>{stage}</Text>
            </View>
          </View>

          {/* Understanding Your Score */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Understanding Your Score</Text>

            <View style={styles.stagesContainer}>
              {/* Recognition Stage */}
              <View style={[styles.stageItem, stage === 'Recognition' && styles.stageItemActive]}>
                <View style={styles.stageHeader}>
                  <Text style={styles.stageIcon}>🌱</Text>
                  <View style={styles.stageInfo}>
                    <Text style={[styles.stageName, stage === 'Recognition' && styles.stageNameActive]}>
                      Recognition (0-30)
                    </Text>
                    <Text style={styles.stageDescription}>
                      You are beginning to recognize this quality in your life
                    </Text>
                  </View>
                </View>
              </View>

              {/* Encouragement Stage */}
              <View style={[styles.stageItem, stage === 'Encouragement' && styles.stageItemActive]}>
                <View style={styles.stageHeader}>
                  <Text style={styles.stageIcon}>🌿</Text>
                  <View style={styles.stageInfo}>
                    <Text style={[styles.stageName, stage === 'Encouragement' && styles.stageNameActive]}>
                      Encouragement (31-70)
                    </Text>
                    <Text style={styles.stageDescription}>
                      You are actively developing this quality
                    </Text>
                  </View>
                </View>
              </View>

              {/* Realization Stage */}
              <View style={[styles.stageItem, stage === 'Realization' && styles.stageItemActive]}>
                <View style={styles.stageHeader}>
                  <Text style={styles.stageIcon}>🌳</Text>
                  <View style={styles.stageInfo}>
                    <Text style={[styles.stageName, stage === 'Realization' && styles.stageNameActive]}>
                      Realization (71-100)
                    </Text>
                    <Text style={styles.stageDescription}>
                      You have realized this quality deeply
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* About This Parami */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About This Parami</Text>
            <Text style={styles.bodyText}>{advice.description}</Text>
          </View>

          {/* Guidance for Growth */}
          <View style={[styles.card, styles.adviceCard]}>
            <Text style={styles.cardTitle}>Guidance for Growth</Text>
            <View style={styles.adviceContainer}>
              <Text style={styles.adviceText}>{advice.adviceForImprovement}</Text>
            </View>
          </View>

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.warmStone,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: Colors.warmStone,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.pureWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    marginBottom: 20,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  paramiName: {
    ...Typography.h1,
    fontSize: 32,
    color: Colors.deepCharcoal,
    marginBottom: 4,
  },
  englishName: {
    ...Typography.h2,
    fontSize: 20,
    color: Colors.mediumStone,
  },
  scoreBadge: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreTitle: {
    ...Typography.caption,
    color: Colors.deepStone,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 64,
    fontWeight: '700',
    marginBottom: 12,
  },
  stageBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stageText: {
    ...Typography.h3,
    color: Colors.pureWhite,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginBottom: 16,
  },
  stagesContainer: {
    gap: 12,
  },
  stageItem: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.warmStone,
  },
  stageItemActive: {
    backgroundColor: Colors.saffronGold08,
    borderWidth: 2,
    borderColor: Colors.saffronGold,
  },
  stageHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  stageIcon: {
    fontSize: 28,
  },
  stageInfo: {
    flex: 1,
  },
  stageName: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.deepStone,
    marginBottom: 4,
  },
  stageNameActive: {
    color: Colors.deepCharcoal,
  },
  stageDescription: {
    ...Typography.body,
    color: Colors.mediumStone,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyText: {
    ...Typography.body,
    color: Colors.deepCharcoal,
    lineHeight: 24,
  },
  adviceCard: {
    backgroundColor: Colors.saffronGold08,
    borderLeftWidth: 4,
    borderLeftColor: Colors.saffronGold,
  },
  adviceContainer: {
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.lotusPink,
  },
  adviceText: {
    ...Typography.quote,
    color: Colors.deepStone,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  bottomPadding: {
    height: 32,
  },
});

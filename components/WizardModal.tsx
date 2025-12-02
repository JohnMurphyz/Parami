import { useState, useRef } from 'react';
import { Modal, View, FlatList, Dimensions, StyleSheet, TouchableOpacity, Text, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Parami } from '../types';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import WizardScreen1 from './wizard/WizardScreen1';
import WizardScreen2 from './wizard/WizardScreen2';
import WizardScreen3 from './wizard/WizardScreen3';

const { width } = Dimensions.get('window');

interface WizardModalProps {
  visible: boolean;
  parami: Parami;
  onComplete: (customPractice?: string) => void;
  onSkip: () => void;
}

export default function WizardModal({ visible, parami, onComplete, onSkip }: WizardModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customPractice, setCustomPractice] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const screens = [
    { id: '1', component: WizardScreen1 },
    { id: '2', component: WizardScreen2 },
    { id: '3', component: WizardScreen3 },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const handleBegin = () => {
    onComplete(customPractice || undefined);
  };

  const renderScreen = ({ item, index }: { item: any; index: number }) => {
    const ScreenComponent = item.component;
    return (
      <View style={{ width }}>
        <ScreenComponent
          parami={parami}
          currentIndex={parami.id}
          totalCount={10}
          customPractice={customPractice}
          onCustomPracticeChange={setCustomPractice}
          onBegin={handleBegin}
          isActive={currentIndex === index}
        />
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onSkip}
    >
      <View style={styles.container}>
        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkip}
          accessibilityLabel="Skip wizard"
          accessibilityHint="Closes the welcome wizard without creating a custom practice"
          accessibilityRole="button"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Swipeable Screens */}
        <FlatList
          ref={flatListRef}
          data={screens}
          renderItem={renderScreen}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
        />

        {/* Page Indicators */}
        <View style={styles.pagination}>
          {screens.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmStone,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    ...Typography.body,
    color: Colors.mediumStone,
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 40,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.saffronGold,
    width: 24,
    height: 8,
  },
  dotInactive: {
    backgroundColor: Colors.softAsh,
  },
});

import React, { useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAppStore } from '@store/appStore';

const SLIDES = [
  {
    id: '1',
    title: 'Learn Practical Skills Offline',
    description: 'Access lessons anytime, anywhere. No internet required after first sync.',
  },
  {
    id: '2',
    title: 'Get Verifiable Skill NFTs',
    description: 'Earn digital credentials that prove your mastery. Own your achievements.',
  },
  {
    id: '3',
    title: 'Secure Skill Wallet',
    description: 'We create a secure wallet for you. You own your credentials.',
  },
];

const { width } = Dimensions.get('window');

export const OnboardingScreen = ({ navigation }: any) => {
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);

  const handleNext = () => {
    if (currentIndex.current < SLIDES.length - 1) {
      currentIndex.current += 1;
      flatListRef.current?.scrollToIndex({ index: currentIndex.current, animated: true });
    } else {
      useAppStore.setState({ showOnboarding: false });
      navigation.navigate('SignIn');
    }
  };

  const renderSlide = ({ item }: any) => (
    <View style={[styles.slide, { width }]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        scrollEventThrottle={16}
      />
      <View style={styles.bottomContainer}>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          {currentIndex.current === SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#666',
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  button: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
});

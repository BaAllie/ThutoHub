import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { BookOpen, Play, TrendingUp, ArrowRight } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const CAROUSEL_WIDTH = screenWidth - 40;
const SLIDE_WIDTH = CAROUSEL_WIDTH / 3;

const onboardingData = [
  {
    id: 1,
    title: 'Learn',
    description: 'Discover new things every day',
    icon: BookOpen,
    color: '#4F46E5',
  },
  {
    id: 2,
    title: 'Play',
    description: 'Have fun while learning',
    icon: Play,
    color: '#10B981',
  },
  {
    id: 3,
    title: 'Track Progress',
    description: 'See how much you grow',
    icon: TrendingUp,
    color: '#F97316',
  },
];

export default function WelcomeScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = contentOffsetX;
    const currentSlide = Math.round(contentOffsetX / SLIDE_WIDTH);
    setActiveSlide(currentSlide);
  };

  const renderCarouselItem = (item: typeof onboardingData[0], index: number) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * SLIDE_WIDTH,
        index * SLIDE_WIDTH,
        (index + 1) * SLIDE_WIDTH,
      ];

      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolate.CLAMP
      );

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.5, 1, 0.5],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    const IconComponent = item.icon;

    return (
      <Animated.View key={item.id} style={[styles.carouselItem, animatedStyle]}>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <IconComponent size={24} color="white" strokeWidth={2} />
        </View>
        <Text style={styles.carouselTitle}>{item.title}</Text>
        <Text style={styles.carouselDescription}>{item.description}</Text>
      </Animated.View>
    );
  };

  const renderDot = (index: number) => {
    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollX.value,
        [(index - 1) * SLIDE_WIDTH, index * SLIDE_WIDTH, (index + 1) * SLIDE_WIDTH],
        [0.3, 1, 0.3],
        Extrapolate.CLAMP
      );

      const scale = interpolate(
        scrollX.value,
        [(index - 1) * SLIDE_WIDTH, index * SLIDE_WIDTH, (index + 1) * SLIDE_WIDTH],
        [0.8, 1.2, 0.8],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{ scale }],
      };
    });

    return (
      <Animated.View
        key={index}
        style={[styles.dot, animatedStyle]}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Onboarding Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.carouselContent}
            style={styles.carousel}
          >
            {onboardingData.map((item, index) => renderCarouselItem(item, index))}
          </ScrollView>
          
          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {onboardingData.map((_, index) => renderDot(index))}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Hero Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/6205509/pexels-photo-6205509.jpeg?auto=compress&cs=tinysrgb&w=600',
              }}
              style={styles.illustration}
              resizeMode="cover"
            />
            <View style={styles.illustrationOverlay}>
              <Text style={styles.overlayText}>Welcome to Learning!</Text>
            </View>
          </View>

          {/* Welcome Text */}
          <View style={styles.textContainer}>
            <Text style={styles.welcomeTitle}>Let's Start Your{'\n'}Learning Journey!</Text>
            <Text style={styles.welcomeSubtitle}>
              Discover amazing activities, track your progress, and have fun while learning new things every day.
            </Text>
          </View>

          {/* Get Started Button */}
          <Link href="/registration" asChild>
            <TouchableOpacity
              style={styles.getStartedButton}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Get Started with learning"
              accessibilityHint="Tap to begin registration and start your learning journey"
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <ArrowRight size={20} color="white" strokeWidth={2.5} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5', // Indigo primary
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  carouselContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  carousel: {
    height: 140,
  },
  carouselContent: {
    paddingHorizontal: 0,
  },
  carouselItem: {
    width: SLIDE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  carouselTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: 'white',
    marginBottom: 4,
    textAlign: 'center',
  },
  carouselDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 4,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationContainer: {
    width: 280,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  illustrationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(79, 70, 229, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  overlayText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  welcomeTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  welcomeSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  getStartedButton: {
    backgroundColor: '#10B981', // Green secondary
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    minWidth: 200,
    minHeight: 56, // Accessibility: minimum touch target
  },
  getStartedText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: 'white',
    marginRight: 8,
  },
});
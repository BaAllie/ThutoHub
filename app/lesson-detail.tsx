import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Globe, 
  ChevronDown, 
  BookOpen, 
  Clock, 
  Star, 
  Brain,
  Download, 
  Share,
  RotateCcw,
  Users,
  Trophy
} from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import LoadingSpinner from '@/components/LoadingSpinner';

const { width: screenWidth } = Dimensions.get('window');

interface LessonContent {
  id: string;
  title: string;
  summary: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  grade: string;
  subject: string;
  imageUrl: string;
  audioUrl?: string;
  content: {
    sections: LessonSection[];
    vocabulary?: VocabularyItem[];
    keyPoints?: string[];
    activities?: ActivityItem[];
  };
  progress: number;
  isCompleted: boolean;
  language: string;
}

interface LessonSection {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  duration: number;
  type: 'text' | 'interactive' | 'video' | 'exercise';
}

interface VocabularyItem {
  word: string;
  definition: string;
  pronunciation?: string;
  example?: string;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'exercise' | 'game';
  points: number;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
];

// Mock lesson content - In production, this would come from Firebase Storage
const MOCK_LESSON_CONTENT: LessonContent = {
  id: '1',
  title: 'Introduction to Addition',
  summary: 'Learn the fundamentals of addition through visual examples, interactive exercises, and real-world applications. This comprehensive lesson covers basic addition concepts, number recognition, counting strategies, and problem-solving techniques that will build a strong mathematical foundation.',
  description: 'Master the basics of adding numbers with fun visual examples and interactive exercises.',
  duration: 25,
  difficulty: 'Beginner',
  grade: '1st Grade',
  subject: 'Mathematics',
  imageUrl: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800',
  audioUrl: 'https://example.com/lesson-audio.mp3',
  content: {
    sections: [
      {
        id: '1',
        title: 'What is Addition?',
        content: 'Addition is one of the most important math skills you\'ll learn! When we add, we\'re putting numbers together to make a bigger number. Think of it like collecting toys - if you have 2 toy cars and someone gives you 1 more toy car, you now have 3 toy cars total!\n\nWe use special symbols in addition:\n• The plus sign (+) means "add"\n• The equals sign (=) means "the same as"\n\nSo when we write 2 + 1 = 3, we\'re saying "2 plus 1 equals 3".\n\nAddition is everywhere around us! When you count your fingers, add cookies to a jar, or combine groups of objects, you\'re using addition. It\'s like magic - you start with some things, add more things, and suddenly you have even more!',
        imageUrl: 'https://images.pexels.com/photos/6256217/pexels-photo-6256217.jpeg?auto=compress&cs=tinysrgb&w=800',
        duration: 5,
        type: 'text'
      },
      {
        id: '2',
        title: 'Adding with Objects',
        content: 'Let\'s practice adding with real objects! This is the most fun way to learn addition because you can see and touch everything.\n\nImagine you have some delicious apples:\n🍎🍎 (2 apples)\n\nNow someone gives you 1 more apple:\n🍎 (1 more apple)\n\nHow many apples do you have now? Let\'s count them all together:\n🍎🍎🍎 (3 apples total!)\n\nSo 2 + 1 = 3. You can use this method with any objects - toys, books, cookies, blocks, or anything you can count!\n\nTry this at home: Get some small objects like buttons, coins, or candies. Practice adding different amounts and count the total. This hands-on approach makes addition feel natural and easy.',
        imageUrl: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=800',
        duration: 6,
        type: 'interactive'
      },
      {
        id: '3',
        title: 'Using Your Fingers',
        content: 'Your fingers are amazing tools for addition! They\'re always with you, so you can practice anywhere. Here\'s how to add 3 + 2 using your fingers:\n\n1. Hold up 3 fingers on one hand ✋ (but only 3 fingers)\n2. Hold up 2 fingers on your other hand ✌️\n3. Count all the fingers you\'re holding up: 1, 2, 3, 4, 5\n4. So 3 + 2 = 5!\n\nThis method works great for adding numbers up to 10. Try it with different numbers and see how it helps you!\n\nFinger counting tips:\n• Start with the bigger number first\n• Count slowly and carefully\n• Practice with a friend or family member\n• Make it a game - who can solve finger addition problems fastest?',
        duration: 5,
        type: 'interactive'
      },
      {
        id: '4',
        title: 'Number Line Magic',
        content: 'A number line is like a road for numbers! It helps us see addition clearly and makes solving problems easier.\n\n0 — 1 — 2 — 3 — 4 — 5 — 6 — 7 — 8 — 9 — 10\n\nTo add 4 + 3 using a number line:\n1. Start at number 4 on the line\n2. Jump forward 3 spaces: 5, 6, 7\n3. You land on 7!\n4. So 4 + 3 = 7\n\nThe number line helps you visualize addition as moving forward. The bigger the number you\'re adding, the further you jump!\n\nNumber line benefits:\n• Makes addition visual and easy to understand\n• Helps you see patterns in numbers\n• Great for checking your answers\n• Works for any addition problem\n\nYou can draw your own number line on paper or use your imagination!',
        imageUrl: 'https://images.pexels.com/photos/6256065/pexels-photo-6256065.jpeg?auto=compress&cs=tinysrgb&w=800',
        duration: 7,
        type: 'text'
      },
      {
        id: '5',
        title: 'Real-World Addition',
        content: 'Addition is everywhere in real life! Let\'s explore some fun examples where you use addition every day:\n\n🏪 At the Store:\nIf you buy 2 apples and 3 oranges, how many fruits do you have? 2 + 3 = 5 fruits!\n\n🎈 At a Party:\nYou have 4 balloons and your friend brings 2 more. Now you have 4 + 2 = 6 balloons!\n\n📚 Reading Books:\nYou read 1 book on Monday and 2 books on Tuesday. You read 1 + 2 = 3 books total!\n\n🍪 Baking Cookies:\nMom bakes 5 cookies and Dad bakes 3 cookies. Together they made 5 + 3 = 8 cookies!\n\nCan you think of other times when you use addition? Look around your house, school, or playground - addition is everywhere!',
        imageUrl: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=800',
        duration: 6,
        type: 'exercise'
      }
    ],
    vocabulary: [
      {
        word: 'Addition',
        definition: 'Putting numbers together to make a bigger number',
        pronunciation: 'uh-DISH-uhn',
        example: 'We use addition to find out how many toys we have in total.'
      },
      {
        word: 'Plus Sign (+)',
        definition: 'The symbol that means "add"',
        pronunciation: 'plus sine',
        example: 'In 2 + 3, the plus sign tells us to add 2 and 3 together.'
      },
      {
        word: 'Equals Sign (=)',
        definition: 'The symbol that means "the same as"',
        pronunciation: 'EE-kwuhls sine',
        example: 'The equals sign shows us what the answer is: 2 + 3 = 5.'
      },
      {
        word: 'Sum',
        definition: 'The answer you get when you add numbers together',
        pronunciation: 'suhm',
        example: 'When we add 4 + 2, the sum is 6.'
      },
      {
        word: 'Count',
        definition: 'To say numbers in order to find out how many',
        pronunciation: 'kownt',
        example: 'We count objects to help us add: 1, 2, 3, 4, 5!'
      }
    ],
    keyPoints: [
      'Addition means putting numbers together to make a bigger number',
      'Use the plus sign (+) to show addition and equals sign (=) to show the answer',
      'Count objects, fingers, or use a number line to help solve addition problems',
      'Practice makes addition easier and faster - try it every day!',
      'Addition is everywhere in real life - at home, school, and play',
      'Start with smaller numbers and work your way up to bigger ones',
      'Always double-check your answers by counting again'
    ],
    activities: [
      {
        id: 'quiz1',
        title: 'Addition Quiz',
        description: 'Test your addition skills with fun questions',
        type: 'quiz',
        points: 100
      },
      {
        id: 'game1',
        title: 'Addition Adventure',
        description: 'Play games while practicing addition',
        type: 'game',
        points: 50
      },
      {
        id: 'exercise1',
        title: 'Practice Problems',
        description: 'Solve addition problems step by step',
        type: 'exercise',
        points: 75
      }
    ]
  },
  progress: 0,
  isCompleted: false,
  language: 'en'
};

export default function LessonDetailScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [userProgress, setUserProgress] = useState(0);

  useEffect(() => {
    loadLessonContent();
    loadUserProgress();
  }, []);

  const loadLessonContent = async () => {
    try {
      setLoading(true);
      
      // In production, this would fetch from Firebase Storage
      // const lessonRef = ref(storage, `lessons/${params.lessonId}/content.json`);
      // const downloadURL = await getDownloadURL(lessonRef);
      // const response = await fetch(downloadURL);
      // const lessonData = await response.json();
      
      // For demo, we'll use mock data
      setLesson(MOCK_LESSON_CONTENT);
      setSelectedLanguage(params.language as string || 'en');
    } catch (error) {
      console.error('Error loading lesson content:', error);
      Alert.alert('Error', 'Failed to load lesson content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!user || !params.lessonId) return;

    try {
      const progressRef = doc(db, 'progress', `${user.uid}_${params.lessonId}`);
      const progressDoc = await getDoc(progressRef);
      
      if (progressDoc.exists()) {
        const data = progressDoc.data();
        setUserProgress(data.progress || 0);
        setCurrentSection(data.currentSection || 0);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const handlePlayAudio = () => {
    if (Platform.OS === 'web') {
      // Web Text-to-Speech implementation
      if ('speechSynthesis' in window) {
        if (isPlaying) {
          window.speechSynthesis.cancel();
          setIsPlaying(false);
        } else {
          const currentSectionData = lesson?.content.sections[currentSection];
          if (currentSectionData) {
            const utterance = new SpeechSynthesisUtterance(currentSectionData.content);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = isMuted ? 0 : 1;
            
            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);
            
            window.speechSynthesis.speak(utterance);
          }
        }
      } else {
        Alert.alert('Not Supported', 'Text-to-speech is not supported in this browser.');
      }
    } else {
      // For mobile platforms, you would use expo-speech
      Alert.alert('Audio', 'Text-to-speech feature will be available in the mobile app.');
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    setTranslating(true);
    setSelectedLanguage(languageCode);
    setShowLanguageDropdown(false);
    
    try {
      // In production, this would use Google Translate API
      // For demo purposes, we'll simulate translation
      if (languageCode !== 'en' && lesson) {
        const translatedLesson = {
          ...lesson,
          title: `[${languageCode.toUpperCase()}] ${lesson.title}`,
          summary: `[Translated to ${languageCode.toUpperCase()}] ${lesson.summary}`,
          content: {
            ...lesson.content,
            sections: lesson.content.sections.map(section => ({
              ...section,
              title: `[${languageCode.toUpperCase()}] ${section.title}`,
              content: `[Translated to ${languageCode.toUpperCase()}] ${section.content}`
            })),
            vocabulary: lesson.content.vocabulary?.map(item => ({
              ...item,
              definition: `[${languageCode.toUpperCase()}] ${item.definition}`,
              example: item.example ? `[${languageCode.toUpperCase()}] ${item.example}` : undefined
            })),
            keyPoints: lesson.content.keyPoints?.map(point => `[${languageCode.toUpperCase()}] ${point}`)
          }
        };
        setLesson(translatedLesson);
      } else if (languageCode === 'en') {
        // Reset to original English content
        setLesson(MOCK_LESSON_CONTENT);
      }
    } catch (error) {
      console.error('Translation error:', error);
      Alert.alert('Translation Error', 'Failed to translate content. Please try again.');
    } finally {
      setTranslating(false);
    }
  };

  const handleTakeQuiz = () => {
    // Navigate to quiz screen
    router.push({
      pathname: '/quiz',
      params: {
        lessonId: lesson?.id,
        title: lesson?.title,
        subject: lesson?.subject,
        grade: lesson?.grade
      }
    });
  };

  const handleNextSection = () => {
    if (lesson && currentSection < lesson.content.sections.length - 1) {
      const newSection = currentSection + 1;
      setCurrentSection(newSection);
      updateProgress(newSection);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const updateProgress = async (sectionIndex: number) => {
    if (lesson && user) {
      try {
        const newProgress = ((sectionIndex + 1) / lesson.content.sections.length) * 100;
        
        // Update progress in Firestore
        const progressRef = doc(db, 'progress', `${user.uid}_${lesson.id}`);
        await setDoc(progressRef, {
          lessonId: lesson.id,
          userId: user.uid,
          progress: newProgress,
          currentSection: sectionIndex,
          lastAccessed: new Date(),
          isCompleted: newProgress === 100,
          timeSpent: 0 // You could track this
        }, { merge: true });

        setUserProgress(newProgress);
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F97316';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSectionTypeIcon = (type: string) => {
    switch (type) {
      case 'interactive': return '🎮';
      case 'video': return '🎥';
      case 'exercise': return '✏️';
      default: return '📖';
    }
  };

  const getCurrentLanguage = () => {
    return LANGUAGES.find(lang => lang.code === selectedLanguage) || LANGUAGES[0];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={32} color="#4F46E5" />
          <Text style={styles.loadingText}>Loading lesson...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <BookOpen size={64} color="#9CA3AF" strokeWidth={1.5} />
          <Text style={styles.errorTitle}>Lesson Not Found</Text>
          <Text style={styles.errorText}>The requested lesson could not be loaded.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentSectionData = lesson.content.sections[currentSection];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color="#1F2937" strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {lesson.title}
          </Text>
          <Text style={styles.headerSubtitle}>
            {getSectionTypeIcon(currentSectionData.type)} Section {currentSection + 1} of {lesson.content.sections.length}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => Alert.alert('Share', 'Share this amazing lesson with friends!')}
            accessibilityRole="button"
            accessibilityLabel="Share lesson"
          >
            <Share size={20} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => Alert.alert('Download', 'Download for offline learning coming soon!')}
            accessibilityRole="button"
            accessibilityLabel="Download lesson"
          >
            <Download size={20} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill, 
            { width: `${userProgress}%` }
          ]} />
        </View>
        <Text style={styles.progressText}>
          {Math.round(userProgress)}% complete • {currentSectionData.duration} min remaining
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: currentSectionData.imageUrl || lesson.imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{currentSectionData.title}</Text>
              <View style={styles.heroMeta}>
                <View style={styles.metaItem}>
                  <Clock size={16} color="white" strokeWidth={2} />
                  <Text style={styles.metaText}>{currentSectionData.duration} min</Text>
                </View>
                <View style={styles.metaItem}>
                  <Users size={16} color="white" strokeWidth={2} />
                  <Text style={styles.metaText}>{lesson.grade}</Text>
                </View>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(lesson.difficulty) }
                ]}>
                  <Text style={styles.difficultyText}>{lesson.difficulty}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Lesson Summary (only show on first section) */}
        {currentSection === 0 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>📚 Lesson Overview</Text>
            <Text style={styles.summaryText}>{lesson.summary}</Text>
            
            <View style={styles.lessonStats}>
              <View style={styles.statItem}>
                <BookOpen size={20} color="#4F46E5" strokeWidth={2} />
                <Text style={styles.statNumber}>{lesson.content.sections.length}</Text>
                <Text style={styles.statLabel}>Sections</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={20} color="#10B981" strokeWidth={2} />
                <Text style={styles.statNumber}>{lesson.duration}</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
              <View style={styles.statItem}>
                <Trophy size={20} color="#F97316" strokeWidth={2} />
                <Text style={styles.statNumber}>100</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
            </View>
          </View>
        )}

        {/* Controls Section */}
        <View style={styles.controlsContainer}>
          {/* Audio Controls */}
          <View style={styles.audioControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setCurrentSection(0)}
              accessibilityRole="button"
              accessibilityLabel="Restart lesson"
            >
              <RotateCcw size={20} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.playButton, isPlaying && styles.playButtonActive]}
              onPress={handlePlayAudio}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? (
                <Pause size={24} color="white" strokeWidth={2} />
              ) : (
                <Play size={24} color="white" strokeWidth={2} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setIsMuted(!isMuted)}
              accessibilityRole="button"
              accessibilityLabel={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? (
                <VolumeX size={20} color="#6B7280" strokeWidth={2} />
              ) : (
                <Volume2 size={20} color="#6B7280" strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>

          {/* Language Selector */}
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
            disabled={translating}
            accessibilityRole="button"
            accessibilityLabel="Change language"
          >
            {translating ? (
              <LoadingSpinner size={16} color="#4F46E5" />
            ) : (
              <>
                <Globe size={16} color="#4F46E5" strokeWidth={2} />
                <Text style={styles.languageFlag}>{getCurrentLanguage().flag}</Text>
                <Text style={styles.languageText}>{getCurrentLanguage().code.toUpperCase()}</Text>
                <ChevronDown size={16} color="#6B7280" strokeWidth={2} />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Language Dropdown */}
        {showLanguageDropdown && (
          <View style={styles.languageDropdown}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {LANGUAGES.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageOption,
                    selectedLanguage === language.code && styles.languageOptionSelected
                  ]}
                  onPress={() => handleLanguageChange(language.code)}
                >
                  <Text style={styles.languageOptionFlag}>{language.flag}</Text>
                  <Text style={[
                    styles.languageOptionText,
                    selectedLanguage === language.code && styles.languageOptionTextSelected
                  ]}>
                    {language.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Section Content */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{currentSectionData.title}</Text>
            <Text style={styles.sectionType}>{getSectionTypeIcon(currentSectionData.type)} {currentSectionData.type}</Text>
          </View>
          <Text style={styles.sectionContent}>{currentSectionData.content}</Text>
        </View>

        {/* Vocabulary Section (only show on first section) */}
        {currentSection === 0 && lesson.content.vocabulary && (
          <View style={styles.vocabularyContainer}>
            <Text style={styles.vocabularyTitle}>📝 Key Vocabulary</Text>
            {lesson.content.vocabulary.map((item, index) => (
              <View key={index} style={styles.vocabularyItem}>
                <View style={styles.vocabularyHeader}>
                  <Text style={styles.vocabularyWord}>{item.word}</Text>
                  {item.pronunciation && (
                    <Text style={styles.vocabularyPronunciation}>
                      /{item.pronunciation}/
                    </Text>
                  )}
                </View>
                <Text style={styles.vocabularyDefinition}>{item.definition}</Text>
                {item.example && (
                  <Text style={styles.vocabularyExample}>
                    💡 Example: {item.example}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Key Points Section (only show on last section) */}
        {currentSection === lesson.content.sections.length - 1 && lesson.content.keyPoints && (
          <View style={styles.keyPointsContainer}>
            <Text style={styles.keyPointsTitle}>⭐ Key Points to Remember</Text>
            {lesson.content.keyPoints.map((point, index) => (
              <View key={index} style={styles.keyPointItem}>
                <Star size={16} color="#F97316" strokeWidth={2} fill="#F97316" />
                <Text style={styles.keyPointText}>{point}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Activities Section (only show on last section) */}
        {currentSection === lesson.content.sections.length - 1 && lesson.content.activities && (
          <View style={styles.activitiesContainer}>
            <Text style={styles.activitiesTitle}>🎯 Practice Activities</Text>
            {lesson.content.activities.map((activity, index) => (
              <TouchableOpacity key={index} style={styles.activityItem}>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </View>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityPoints}>+{activity.points} pts</Text>
                  <ArrowLeft size={16} color="#4F46E5" strokeWidth={2} style={{ transform: [{ rotate: '180deg' }] }} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, currentSection === 0 && styles.navButtonDisabled]}
            onPress={handlePreviousSection}
            disabled={currentSection === 0}
            accessibilityRole="button"
            accessibilityLabel="Previous section"
          >
            <ArrowLeft size={20} color={currentSection === 0 ? "#9CA3AF" : "#4F46E5"} strokeWidth={2} />
            <Text style={[styles.navButtonText, currentSection === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, currentSection === lesson.content.sections.length - 1 && styles.navButtonDisabled]}
            onPress={handleNextSection}
            disabled={currentSection === lesson.content.sections.length - 1}
            accessibilityRole="button"
            accessibilityLabel="Next section"
          >
            <Text style={[styles.navButtonText, currentSection === lesson.content.sections.length - 1 && styles.navButtonTextDisabled]}>
              Next
            </Text>
            <ArrowLeft size={20} color={currentSection === lesson.content.sections.length - 1 ? "#9CA3AF" : "#4F46E5"} strokeWidth={2} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>

        {/* Quiz Button */}
        <TouchableOpacity
          style={styles.quizButton}
          onPress={handleTakeQuiz}
          accessibilityRole="button"
          accessibilityLabel="Take quiz"
        >
          <Brain size={24} color="white" strokeWidth={2} />
          <Text style={styles.quizButtonText}>Take Quiz & Earn Points</Text>
          <Trophy size={20} color="white" strokeWidth={2} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  errorText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Nunito-Medium',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  heroContainer: {
    height: 240,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 12,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Nunito-Medium',
    fontSize: 12,
    color: 'white',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: 'white',
  },
  summaryContainer: {
    backgroundColor: 'white',
    padding: 24,
    marginTop: 8,
  },
  summaryTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  lessonStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  controlsContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  playButtonActive: {
    backgroundColor: '#EF4444',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  languageFlag: {
    fontSize: 16,
  },
  languageText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#4F46E5',
  },
  languageDropdown: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#F9FAFB',
  },
  languageOptionSelected: {
    backgroundColor: '#4F46E5',
  },
  languageOptionFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  languageOptionText: {
    fontFamily: 'Nunito-Medium',
    fontSize: 14,
    color: '#1F2937',
  },
  languageOptionTextSelected: {
    color: 'white',
  },
  sectionContainer: {
    backgroundColor: 'white',
    padding: 24,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1F2937',
    flex: 1,
  },
  sectionType: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    textTransform: 'capitalize',
  },
  sectionContent: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
  },
  vocabularyContainer: {
    backgroundColor: 'white',
    padding: 24,
    marginTop: 8,
  },
  vocabularyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  vocabularyItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  vocabularyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vocabularyWord: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#4F46E5',
    marginRight: 8,
  },
  vocabularyPronunciation: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  vocabularyDefinition: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  vocabularyExample: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    color: '#059669',
    fontStyle: 'italic',
  },
  keyPointsContainer: {
    backgroundColor: 'white',
    padding: 24,
    marginTop: 8,
  },
  keyPointsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
  },
  keyPointText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  activitiesContainer: {
    backgroundColor: 'white',
    padding: 24,
    marginTop: 8,
  },
  activitiesTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  activityDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  activityMeta: {
    alignItems: 'center',
    gap: 4,
  },
  activityPoints: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#059669',
  },
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    marginTop: 8,
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#4F46E5',
  },
  navButtonTextDisabled: {
    color: '#9CA3AF',
  },
  quizButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    elevation: 4,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    gap: 12,
  },
  quizButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: 'white',
  },
});
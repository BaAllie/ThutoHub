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
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { BookOpen, Globe, ChevronDown, Play, Clock, Star, Users, ArrowRight, Download, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ChildProfile {
  id: string;
  name: string;
  grade: string;
  language: string;
  parentId: string;
}

interface LessonTopic {
  id: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  duration: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  imageUrl: string;
  contentUrl: string;
  isCompleted: boolean;
  progress: number; // 0-100
  totalLessons: number;
  completedLessons: number;
  language: string;
}

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  backgroundColor: string;
  topicCount: number;
}

const SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: '🔢',
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    topicCount: 12
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    topicCount: 8
  },
  {
    id: 'english',
    name: 'English',
    icon: '📚',
    color: '#F97316',
    backgroundColor: '#FFF7ED',
    topicCount: 15
  },
  {
    id: 'history',
    name: 'History',
    icon: '🏛️',
    color: '#8B5CF6',
    backgroundColor: '#F3E8FF',
    topicCount: 6
  },
  {
    id: 'art',
    name: 'Art & Creativity',
    icon: '🎨',
    color: '#EC4899',
    backgroundColor: '#FDF2F8',
    topicCount: 10
  }
];

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

// Mock lesson data - In production, this would come from Firebase Storage
const MOCK_LESSONS: LessonTopic[] = [
  {
    id: '1',
    title: 'Introduction to Addition',
    description: 'Learn the basics of adding numbers with fun visual examples and interactive exercises.',
    grade: '1st Grade',
    subject: 'math',
    duration: 15,
    difficulty: 'Beginner',
    imageUrl: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=600',
    contentUrl: 'lessons/math/addition-basics.json',
    isCompleted: false,
    progress: 0,
    totalLessons: 5,
    completedLessons: 0,
    language: 'en'
  },
  {
    id: '2',
    title: 'Colors and Shapes',
    description: 'Explore different colors and geometric shapes through engaging activities and games.',
    grade: 'Kindergarten',
    subject: 'art',
    duration: 20,
    difficulty: 'Beginner',
    imageUrl: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=600',
    contentUrl: 'lessons/art/colors-shapes.json',
    isCompleted: true,
    progress: 100,
    totalLessons: 4,
    completedLessons: 4,
    language: 'en'
  },
  {
    id: '3',
    title: 'Plant Life Cycle',
    description: 'Discover how plants grow from seeds to full-grown plants with interactive diagrams.',
    grade: '2nd Grade',
    subject: 'science',
    duration: 25,
    difficulty: 'Intermediate',
    imageUrl: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600',
    contentUrl: 'lessons/science/plant-lifecycle.json',
    isCompleted: false,
    progress: 60,
    totalLessons: 6,
    completedLessons: 3,
    language: 'en'
  },
  {
    id: '4',
    title: 'Reading Comprehension',
    description: 'Improve reading skills with engaging stories and comprehension questions.',
    grade: '3rd Grade',
    subject: 'english',
    duration: 30,
    difficulty: 'Intermediate',
    imageUrl: 'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg?auto=compress&cs=tinysrgb&w=600',
    contentUrl: 'lessons/english/reading-comprehension.json',
    isCompleted: false,
    progress: 25,
    totalLessons: 8,
    completedLessons: 2,
    language: 'en'
  },
  {
    id: '5',
    title: 'Ancient Civilizations',
    description: 'Journey through time to learn about ancient Egypt, Greece, and Rome.',
    grade: '4th Grade',
    subject: 'history',
    duration: 35,
    difficulty: 'Advanced',
    imageUrl: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=600',
    contentUrl: 'lessons/history/ancient-civilizations.json',
    isCompleted: false,
    progress: 0,
    totalLessons: 10,
    completedLessons: 0,
    language: 'en'
  },
  {
    id: '6',
    title: 'Multiplication Tables',
    description: 'Master multiplication with interactive tables and memory games.',
    grade: '3rd Grade',
    subject: 'math',
    duration: 20,
    difficulty: 'Intermediate',
    imageUrl: 'https://images.pexels.com/photos/6256065/pexels-photo-6256065.jpeg?auto=compress&cs=tinysrgb&w=600',
    contentUrl: 'lessons/math/multiplication-tables.json',
    isCompleted: false,
    progress: 40,
    totalLessons: 7,
    completedLessons: 3,
    language: 'en'
  }
];

export default function LessonsScreen() {
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [lessons, setLessons] = useState<LessonTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'children'),
      where('parentId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const childrenData: ChildProfile[] = [];
      querySnapshot.forEach((doc) => {
        childrenData.push({
          id: doc.id,
          ...doc.data(),
        } as ChildProfile);
      });
      
      setChildren(childrenData);
      if (childrenData.length > 0 && !selectedChild) {
        setSelectedChild(childrenData[0]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    // Load lessons based on selected child's grade and subject
    loadLessons();
  }, [selectedChild, selectedSubject]);

  const loadLessons = async () => {
    if (!selectedChild) return;

    setLoading(true);
    try {
      // In production, this would fetch from Firebase Storage
      // For now, we'll filter mock data based on grade and subject
      let filteredLessons = MOCK_LESSONS.filter(lesson => {
        const gradeMatch = lesson.grade === selectedChild.grade || selectedSubject === 'all';
        const subjectMatch = selectedSubject === 'all' || lesson.subject === selectedSubject;
        return gradeMatch && subjectMatch;
      });

      // Simulate translation if language is not English
      if (selectedLanguage !== 'en') {
        filteredLessons = await translateLessons(filteredLessons);
      }

      setLessons(filteredLessons);
    } catch (error) {
      console.error('Error loading lessons:', error);
      Alert.alert('Error', 'Failed to load lessons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const translateLessons = async (lessons: LessonTopic[]): Promise<LessonTopic[]> => {
    // In production, this would use Google Translate API
    // For demo purposes, we'll simulate translation
    return lessons.map(lesson => ({
      ...lesson,
      title: `[${selectedLanguage.toUpperCase()}] ${lesson.title}`,
      description: `[Translated to ${selectedLanguage.toUpperCase()}] ${lesson.description}`,
      language: selectedLanguage
    }));
  };

  const handleLanguageChange = async (languageCode: string) => {
    setTranslating(true);
    setSelectedLanguage(languageCode);
    setShowLanguageDropdown(false);
    
    // Simulate translation delay
    setTimeout(() => {
      loadLessons();
      setTranslating(false);
    }, 1000);
  };

  const handleLessonPress = (lesson: LessonTopic) => {
    // Navigate to lesson detail screen
    router.push({
      pathname: '/lesson-detail',
      params: {
        lessonId: lesson.id,
        title: lesson.title,
        subject: lesson.subject,
        grade: selectedChild?.grade || '',
        language: selectedLanguage
      }
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLessons();
    setRefreshing(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F97316';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSubjectInfo = (subjectId: string) => {
    return SUBJECTS.find(s => s.id === subjectId) || SUBJECTS[0];
  };

  const getCurrentLanguage = () => {
    return LANGUAGES.find(lang => lang.code === selectedLanguage) || LANGUAGES[0];
  };

  if (loading && lessons.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={32} color="#4F46E5" />
          <Text style={styles.loadingText}>Loading lessons...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (children.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <BookOpen size={64} color="#9CA3AF" strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>No Learner Profiles</Text>
          <Text style={styles.emptyDescription}>
            Add a child profile to access personalized lessons.
          </Text>
          <TouchableOpacity
            style={styles.addProfileButton}
            onPress={() => router.push('/child-profiles')}
          >
            <Text style={styles.addProfileButtonText}>Add Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Learning Center</Text>
            {selectedChild && (
              <Text style={styles.subtitle}>
                Lessons for {selectedChild.name} • {selectedChild.grade}
              </Text>
            )}
          </View>

          {/* Language Selector */}
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
            disabled={translating}
          >
            {translating ? (
              <LoadingSpinner size={16} color="#4F46E5" />
            ) : (
              <>
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

        {/* Subject Filter */}
        <View style={styles.subjectSection}>
          <Text style={styles.sectionTitle}>Subjects</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.subjectCard,
                selectedSubject === 'all' && styles.subjectCardSelected
              ]}
              onPress={() => setSelectedSubject('all')}
            >
              <Text style={styles.subjectIcon}>📖</Text>
              <Text style={[
                styles.subjectName,
                selectedSubject === 'all' && styles.subjectNameSelected
              ]}>
                All Subjects
              </Text>
            </TouchableOpacity>

            {SUBJECTS.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.subjectCard,
                  { backgroundColor: subject.backgroundColor },
                  selectedSubject === subject.id && styles.subjectCardSelected
                ]}
                onPress={() => setSelectedSubject(subject.id)}
              >
                <Text style={styles.subjectIcon}>{subject.icon}</Text>
                <Text style={[
                  styles.subjectName,
                  { color: subject.color },
                  selectedSubject === subject.id && styles.subjectNameSelected
                ]}>
                  {subject.name}
                </Text>
                <Text style={styles.subjectCount}>{subject.topicCount} topics</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lessons Grid */}
        <View style={styles.lessonsSection}>
          <View style={styles.lessonsSectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedSubject === 'all' ? 'All Lessons' : `${getSubjectInfo(selectedSubject).name} Lessons`}
            </Text>
            <Text style={styles.lessonsCount}>{lessons.length} lessons</Text>
          </View>

          {lessons.length === 0 ? (
            <View style={styles.noLessonsContainer}>
              <BookOpen size={48} color="#9CA3AF" strokeWidth={1.5} />
              <Text style={styles.noLessonsTitle}>No Lessons Available</Text>
              <Text style={styles.noLessonsDescription}>
                Lessons for this grade and subject will be available soon.
              </Text>
            </View>
          ) : (
            <View style={styles.lessonsGrid}>
              {lessons.map((lesson) => (
                <TouchableOpacity
                  key={lesson.id}
                  style={styles.lessonCard}
                  onPress={() => handleLessonPress(lesson)}
                  accessibilityRole="button"
                  accessibilityLabel={`${lesson.title} lesson`}
                >
                  <Image
                    source={{ uri: lesson.imageUrl }}
                    style={styles.lessonImage}
                    resizeMode="cover"
                  />
                  
                  {lesson.isCompleted && (
                    <View style={styles.completedBadge}>
                      <CheckCircle size={16} color="white" strokeWidth={2} fill="#10B981" />
                    </View>
                  )}

                  <View style={styles.lessonContent}>
                    <View style={styles.lessonHeader}>
                      <Text style={styles.lessonTitle} numberOfLines={2}>
                        {lesson.title}
                      </Text>
                      <View style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(lesson.difficulty) }
                      ]}>
                        <Text style={styles.difficultyText}>{lesson.difficulty}</Text>
                      </View>
                    </View>

                    <Text style={styles.lessonDescription} numberOfLines={3}>
                      {lesson.description}
                    </Text>

                    <View style={styles.lessonMeta}>
                      <View style={styles.metaItem}>
                        <Clock size={14} color="#6B7280" strokeWidth={2} />
                        <Text style={styles.metaText}>{lesson.duration} min</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Users size={14} color="#6B7280" strokeWidth={2} />
                        <Text style={styles.metaText}>{lesson.grade}</Text>
                      </View>
                    </View>

                    {lesson.progress > 0 && (
                      <View style={styles.progressSection}>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                width: `${lesson.progress}%`,
                                backgroundColor: getSubjectInfo(lesson.subject).color
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {lesson.completedLessons}/{lesson.totalLessons} completed
                        </Text>
                      </View>
                    )}

                    <View style={styles.lessonActions}>
                      <TouchableOpacity
                        style={[
                          styles.startButton,
                          { backgroundColor: getSubjectInfo(lesson.subject).color }
                        ]}
                        onPress={() => handleLessonPress(lesson)}
                      >
                        <Play size={16} color="white" strokeWidth={2} />
                        <Text style={styles.startButtonText}>
                          {lesson.progress > 0 ? 'Continue' : 'Start'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.downloadButton}>
                        <Download size={16} color="#6B7280" strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  addProfileButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  addProfileButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: 80,
    justifyContent: 'center',
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  languageText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#4F46E5',
    marginRight: 4,
  },
  languageDropdown: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  subjectSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  subjectCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  subjectCardSelected: {
    borderWidth: 2,
    borderColor: '#4F46E5',
    elevation: 4,
  },
  subjectIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  subjectName: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  subjectNameSelected: {
    color: '#4F46E5',
  },
  subjectCount: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  lessonsSection: {
    marginBottom: 30,
  },
  lessonsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  lessonsCount: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  noLessonsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noLessonsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noLessonsDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  lessonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  lessonCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  lessonImage: {
    width: '100%',
    height: 160,
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonContent: {
    padding: 16,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  lessonTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontFamily: 'Nunito-Medium',
    fontSize: 10,
    color: 'white',
  },
  lessonDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  lessonMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Nunito-Medium',
    fontSize: 12,
    color: '#6B7280',
  },
  lessonActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  startButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: 'white',
    marginLeft: 6,
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
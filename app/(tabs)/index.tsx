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
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { LogOut, Users, BookOpen, Brain, Zap, Gamepad2, Star, Trophy, Clock, ChevronRight, Settings, ChartBar as BarChart3 } from 'lucide-react-native';
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
  createdAt: Date;
  avatar?: string;
  progress?: {
    lessonsCompleted: number;
    quizzesCompleted: number;
    flashcardsStudied: number;
    gamesPlayed: number;
    totalPoints: number;
    streak: number;
  };
}

interface ActivityCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
  progress?: number;
  isLocked?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  icon: Icon,
  title,
  description,
  color,
  backgroundColor,
  onPress,
  progress = 0,
  isLocked = false
}) => (
  <TouchableOpacity
    style={[styles.activityCard, { opacity: isLocked ? 0.6 : 1 }]}
    onPress={isLocked ? undefined : onPress}
    disabled={isLocked}
    accessibilityRole="button"
    accessibilityLabel={`${title}: ${description}`}
    accessibilityHint={isLocked ? "This activity is locked" : "Tap to start this activity"}
  >
    <View style={[styles.activityIconContainer, { backgroundColor }]}>
      <Icon size={24} color={color} strokeWidth={2} />
    </View>
    
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityDescription}>{description}</Text>
      
      {progress > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
          </View>
          <Text style={styles.progressText}>{progress}% complete</Text>
        </View>
      )}
    </View>
    
    <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
  </TouchableOpacity>
);

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'children'),
      where('parentId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const childrenData: ChildProfile[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        childrenData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          progress: data.progress || {
            lessonsCompleted: Math.floor(Math.random() * 15),
            quizzesCompleted: Math.floor(Math.random() * 8),
            flashcardsStudied: Math.floor(Math.random() * 25),
            gamesPlayed: Math.floor(Math.random() * 12),
            totalPoints: Math.floor(Math.random() * 500) + 100,
            streak: Math.floor(Math.random() * 7) + 1,
          }
        } as ChildProfile);
      });
      
      childrenData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setChildren(childrenData);
      
      // Auto-select first child if none selected
      if (childrenData.length > 0 && !selectedChild) {
        setSelectedChild(childrenData[0]);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              router.replace('/');
            }
          },
        },
      ]
    );
  };

  const handleSwitchProfile = () => {
    Alert.alert(
      'Switch Profile',
      'Choose a learner profile:',
      [
        ...children.map(child => ({
          text: child.name,
          onPress: () => setSelectedChild(child),
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleActivityPress = (activityType: string) => {
    Alert.alert(
      'Coming Soon!',
      `${activityType} activities will be available in the next update. Stay tuned!`,
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={32} color="#4F46E5" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
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
            Add your first child's profile to get started with their learning journey.
          </Text>
          <TouchableOpacity
            style={styles.addProfileButton}
            onPress={() => router.push('/child-profiles')}
            accessibilityRole="button"
            accessibilityLabel="Add child profile"
          >
            <Text style={styles.addProfileButtonText}>Add Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.parentName}>{user?.displayName || user?.email}</Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSwitchProfile}
              accessibilityRole="button"
              accessibilityLabel="Switch child profile"
            >
              <Users size={20} color="#4F46E5" strokeWidth={2} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleLogout}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
            >
              <LogOut size={20} color="#EF4444" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Selected Child Profile */}
        {selectedChild && (
          <View style={styles.childProfileSection}>
            <View style={styles.childProfileCard}>
              <View style={styles.childProfileHeader}>
                <View style={[styles.childAvatar, { backgroundColor: selectedChild.avatar || '#4F46E5' }]}>
                  <Text style={styles.childAvatarText}>{getInitials(selectedChild.name)}</Text>
                </View>
                
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{selectedChild.name}</Text>
                  <Text style={styles.childDetails}>{selectedChild.grade} • {selectedChild.language}</Text>
                </View>
                
                <View style={styles.streakContainer}>
                  <Star size={16} color="#F97316" strokeWidth={2} fill="#F97316" />
                  <Text style={styles.streakText}>{selectedChild.progress?.streak || 0} day streak</Text>
                </View>
              </View>

              {/* Progress Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Trophy size={20} color="#10B981" strokeWidth={2} />
                  <Text style={styles.statNumber}>{selectedChild.progress?.totalPoints || 0}</Text>
                  <Text style={styles.statLabel}>Points</Text>
                </View>
                
                <View style={styles.statItem}>
                  <BookOpen size={20} color="#4F46E5" strokeWidth={2} />
                  <Text style={styles.statNumber}>{selectedChild.progress?.lessonsCompleted || 0}</Text>
                  <Text style={styles.statLabel}>Lessons</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Brain size={20} color="#8B5CF6" strokeWidth={2} />
                  <Text style={styles.statNumber}>{selectedChild.progress?.quizzesCompleted || 0}</Text>
                  <Text style={styles.statLabel}>Quizzes</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Gamepad2 size={20} color="#F97316" strokeWidth={2} />
                  <Text style={styles.statNumber}>{selectedChild.progress?.gamesPlayed || 0}</Text>
                  <Text style={styles.statLabel}>Games</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Learning Activities */}
        <View style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>Learning Activities</Text>
          
          <ActivityCard
            icon={BookOpen}
            title="Start Lesson"
            description="Interactive lessons tailored to your child's level"
            color="#4F46E5"
            backgroundColor="#EEF2FF"
            onPress={() => handleActivityPress('Lesson')}
            progress={65}
          />
          
          <ActivityCard
            icon={Brain}
            title="Take Quiz"
            description="Test knowledge with fun, engaging quizzes"
            color="#8B5CF6"
            backgroundColor="#F3E8FF"
            onPress={() => handleActivityPress('Quiz')}
            progress={40}
          />
          
          <ActivityCard
            icon={Zap}
            title="Study Flashcards"
            description="Review key concepts with interactive flashcards"
            color="#10B981"
            backgroundColor="#ECFDF5"
            onPress={() => handleActivityPress('Flashcards')}
            progress={80}
          />
          
          <ActivityCard
            icon={Gamepad2}
            title="Play Games"
            description="Learn through fun educational games"
            color="#F97316"
            backgroundColor="#FFF7ED"
            onPress={() => handleActivityPress('Games')}
            progress={25}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleActivityPress('Progress Report')}
              accessibilityRole="button"
              accessibilityLabel="View progress report"
            >
              <BarChart3 size={24} color="#4F46E5" strokeWidth={2} />
              <Text style={styles.quickActionText}>Progress Report</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/child-profiles')}
              accessibilityRole="button"
              accessibilityLabel="Manage profiles"
            >
              <Users size={24} color="#10B981" strokeWidth={2} />
              <Text style={styles.quickActionText}>Manage Profiles</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleActivityPress('Study Schedule')}
              accessibilityRole="button"
              accessibilityLabel="Set study schedule"
            >
              <Clock size={24} color="#F97316" strokeWidth={2} />
              <Text style={styles.quickActionText}>Study Schedule</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/settings')}
              accessibilityRole="button"
              accessibilityLabel="Open settings"
            >
              <Settings size={24} color="#8B5CF6" strokeWidth={2} />
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Motivational Section */}
        <View style={styles.motivationSection}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=600',
            }}
            style={styles.motivationImage}
            resizeMode="cover"
          />
          <View style={styles.motivationOverlay}>
            <Text style={styles.motivationTitle}>Keep Learning!</Text>
            <Text style={styles.motivationText}>
              {selectedChild?.name} is doing great! Continue the learning journey together.
            </Text>
          </View>
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
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  parentName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  childProfileSection: {
    marginBottom: 30,
  },
  childProfileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  childProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  childAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  childAvatarText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: 'white',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 2,
  },
  childDetails: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#F97316',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  activitiesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  activityDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 4,
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
  quickActionsSection: {
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickActionText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  motivationSection: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    height: 160,
  },
  motivationImage: {
    width: '100%',
    height: '100%',
  },
  motivationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(79, 70, 229, 0.9)',
    padding: 20,
  },
  motivationTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: 'white',
    marginBottom: 4,
  },
  motivationText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
});
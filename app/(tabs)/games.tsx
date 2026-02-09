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
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { 
  Gamepad2, 
  Play, 
  Trophy, 
  Star, 
  Clock, 
  Target, 
  Brain, 
  Zap,
  Award,
  TrendingUp,
  Calendar,
  Users,
  ChevronRight,
  RotateCcw,
  Medal
} from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  doc,
  setDoc,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import LoadingSpinner from '@/components/LoadingSpinner';

const { width: screenWidth } = Dimensions.get('window');

interface ChildProfile {
  id: string;
  name: string;
  grade: string;
  language: string;
  parentId: string;
}

interface GameData {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: number; // in minutes
  imageUrl: string;
  gameType: 'web' | 'native' | 'hybrid';
  gameUrl?: string; // For web games
  component?: string; // For native games
  skills: string[];
  ageRange: string;
  maxScore: number;
  isLocked: boolean;
  requiredLevel: number;
}

interface GameScore {
  id: string;
  gameId: string;
  childId: string;
  score: number;
  maxScore: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  difficulty: string;
  achievements: string[];
}

interface GameStats {
  totalGamesPlayed: number;
  totalTimeSpent: number;
  averageScore: number;
  bestScore: number;
  favoriteGame: string;
  currentStreak: number;
  totalAchievements: number;
}

// Mock games data - In production, this would come from Firestore
const EDUCATIONAL_GAMES: GameData[] = [
  {
    id: 'math-adventure',
    title: 'Math Adventure Quest',
    description: 'Embark on an exciting journey through magical lands while solving addition and subtraction problems. Collect gems and unlock new worlds!',
    category: 'Mathematics',
    difficulty: 'Easy',
    estimatedTime: 15,
    imageUrl: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800',
    gameType: 'hybrid',
    gameUrl: '/games/math-adventure',
    skills: ['Addition', 'Subtraction', 'Number Recognition', 'Problem Solving'],
    ageRange: '5-8 years',
    maxScore: 1000,
    isLocked: false,
    requiredLevel: 1
  },
  {
    id: 'word-wizard',
    title: 'Word Wizard Academy',
    description: 'Cast spelling spells and build vocabulary in this magical word adventure. Help the wizard collect letters to create powerful words!',
    category: 'Language Arts',
    difficulty: 'Medium',
    estimatedTime: 20,
    imageUrl: 'https://images.pexels.com/photos/8923080/pexels-photo-8923080.jpeg?auto=compress&cs=tinysrgb&w=800',
    gameType: 'web',
    gameUrl: '/games/word-wizard',
    skills: ['Spelling', 'Vocabulary', 'Reading', 'Letter Recognition'],
    ageRange: '6-10 years',
    maxScore: 1500,
    isLocked: false,
    requiredLevel: 1
  },
  {
    id: 'science-lab',
    title: 'Science Lab Explorer',
    description: 'Conduct fun experiments and discover the wonders of science! Mix chemicals, observe reactions, and learn about the natural world.',
    category: 'Science',
    difficulty: 'Hard',
    estimatedTime: 25,
    imageUrl: 'https://images.pexels.com/photos/8923076/pexels-photo-8923076.jpeg?auto=compress&cs=tinysrgb&w=800',
    gameType: 'native',
    component: 'ScienceLabGame',
    skills: ['Scientific Method', 'Observation', 'Hypothesis', 'Experimentation'],
    ageRange: '8-12 years',
    maxScore: 2000,
    isLocked: true,
    requiredLevel: 5
  },
  {
    id: 'geography-explorer',
    title: 'Geography Explorer',
    description: 'Travel around the world and learn about different countries, capitals, and cultures. Become a geography expert!',
    category: 'Geography',
    difficulty: 'Medium',
    estimatedTime: 18,
    imageUrl: 'https://images.pexels.com/photos/8923077/pexels-photo-8923077.jpeg?auto=compress&cs=tinysrgb&w=800',
    gameType: 'web',
    gameUrl: '/games/geography-explorer',
    skills: ['World Knowledge', 'Map Reading', 'Cultural Awareness', 'Memory'],
    ageRange: '7-11 years',
    maxScore: 1200,
    isLocked: false,
    requiredLevel: 2
  }
];

export default function GamesScreen() {
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [games, setGames] = useState<GameData[]>([]);
  const [gameScores, setGameScores] = useState<GameScore[]>([]);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Mathematics', 'Language Arts', 'Science', 'Geography'];

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
    loadGames();
  }, [selectedChild]);

  useEffect(() => {
    if (selectedChild) {
      loadGameScores();
      loadGameStats();
    }
  }, [selectedChild]);

  const loadGames = async () => {
    try {
      // In production, this would fetch from Firestore
      // const gamesRef = collection(db, 'games');
      // const gamesSnapshot = await getDocs(gamesRef);
      // const gamesData = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // For demo, we'll use mock data
      setGames(EDUCATIONAL_GAMES);
    } catch (error) {
      console.error('Error loading games:', error);
      Alert.alert('Error', 'Failed to load games. Please try again.');
    }
  };

  const loadGameScores = async () => {
    if (!selectedChild) return;

    try {
      const scoresRef = collection(db, 'gameScores');
      const q = query(
        scoresRef,
        where('childId', '==', selectedChild.id),
        orderBy('completedAt', 'desc'),
        limit(20)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const scoresData: GameScore[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          scoresData.push({
            id: doc.id,
            ...data,
            completedAt: data.completedAt?.toDate() || new Date(),
          } as GameScore);
        });
        setGameScores(scoresData);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error loading game scores:', error);
    }
  };

  const loadGameStats = async () => {
    if (!selectedChild) return;

    try {
      // Calculate stats from game scores
      const scoresRef = collection(db, 'gameScores');
      const q = query(scoresRef, where('childId', '==', selectedChild.id));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setGameStats({
          totalGamesPlayed: 0,
          totalTimeSpent: 0,
          averageScore: 0,
          bestScore: 0,
          favoriteGame: '',
          currentStreak: 0,
          totalAchievements: 0
        });
        return;
      }

      const scores = snapshot.docs.map(doc => doc.data() as GameScore);
      
      const stats: GameStats = {
        totalGamesPlayed: scores.length,
        totalTimeSpent: scores.reduce((sum, score) => sum + score.timeSpent, 0),
        averageScore: Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length),
        bestScore: Math.max(...scores.map(score => score.score)),
        favoriteGame: getMostPlayedGame(scores),
        currentStreak: calculateStreak(scores),
        totalAchievements: scores.reduce((sum, score) => sum + score.achievements.length, 0)
      };

      setGameStats(stats);
    } catch (error) {
      console.error('Error loading game stats:', error);
    }
  };

  const getMostPlayedGame = (scores: GameScore[]): string => {
    const gameCounts = scores.reduce((acc, score) => {
      acc[score.gameId] = (acc[score.gameId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostPlayedGameId = Object.keys(gameCounts).reduce((a, b) => 
      gameCounts[a] > gameCounts[b] ? a : b, ''
    );

    const game = games.find(g => g.id === mostPlayedGameId);
    return game?.title || 'None';
  };

  const calculateStreak = (scores: GameScore[]): number => {
    // Simple streak calculation - consecutive days with games played
    const sortedScores = scores.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    let streak = 0;
    let currentDate = new Date();
    
    for (const score of sortedScores) {
      const scoreDate = new Date(score.completedAt);
      const daysDiff = Math.floor((currentDate.getTime() - scoreDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streak + 1) {
        streak++;
        currentDate = scoreDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const handlePlayGame = async (game: GameData) => {
    if (game.isLocked) {
      Alert.alert(
        'Game Locked',
        `This game requires level ${game.requiredLevel}. Keep playing other games to unlock it!`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (!selectedChild) {
      Alert.alert('Error', 'Please select a child profile first.');
      return;
    }

    // Record game start
    try {
      const gameSessionRef = doc(collection(db, 'gameSessions'));
      await setDoc(gameSessionRef, {
        gameId: game.id,
        childId: selectedChild.id,
        startedAt: new Date(),
        status: 'in_progress'
      });

      // Navigate based on game type
      switch (game.gameType) {
        case 'web':
          // For web games, navigate to a WebView screen
          router.push({
            pathname: '/game-webview',
            params: {
              gameId: game.id,
              gameUrl: game.gameUrl,
              title: game.title,
              sessionId: gameSessionRef.id
            }
          });
          break;
        case 'native':
          // For native games, navigate to the specific game component
          router.push({
            pathname: '/game-native',
            params: {
              gameId: game.id,
              component: game.component,
              title: game.title,
              sessionId: gameSessionRef.id
            }
          });
          break;
        case 'hybrid':
          // For hybrid games, show options or default behavior
          Alert.alert(
            'Choose Game Mode',
            'How would you like to play this game?',
            [
              { text: 'Web Version', onPress: () => playWebVersion(game) },
              { text: 'Mobile Version', onPress: () => playNativeVersion(game) },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
          break;
      }
    } catch (error) {
      console.error('Error starting game session:', error);
      Alert.alert('Error', 'Failed to start game. Please try again.');
    }
  };

  const playWebVersion = (game: GameData) => {
    router.push({
      pathname: '/game-webview',
      params: {
        gameId: game.id,
        gameUrl: game.gameUrl,
        title: game.title
      }
    });
  };

  const playNativeVersion = (game: GameData) => {
    Alert.alert('Coming Soon', 'Native game version will be available in the next update!');
  };

  const handleSwitchProfile = () => {
    if (children.length <= 1) {
      Alert.alert('Info', 'Add more child profiles to switch between them.');
      return;
    }

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadGames(),
      loadGameScores(),
      loadGameStats()
    ]);
    setRefreshing(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F97316';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredGames = selectedCategory === 'All' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={32} color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading games...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (children.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Gamepad2 size={64} color="#9CA3AF" strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>No Learner Profiles</Text>
          <Text style={styles.emptyDescription}>
            Add a child profile to access educational games and track their progress.
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
            <Text style={styles.title}>Educational Games</Text>
            {selectedChild && (
              <Text style={styles.subtitle}>
                Playing as {selectedChild.name} • {selectedChild.grade}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleSwitchProfile}
            accessibilityRole="button"
            accessibilityLabel="Switch child profile"
          >
            <Users size={20} color="#8B5CF6" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Game Stats */}
        {gameStats && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>🎮 Gaming Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Gamepad2 size={20} color="#8B5CF6" strokeWidth={2} />
                <Text style={styles.statNumber}>{gameStats.totalGamesPlayed}</Text>
                <Text style={styles.statLabel}>Games Played</Text>
              </View>
              <View style={styles.statCard}>
                <Clock size={20} color="#10B981" strokeWidth={2} />
                <Text style={styles.statNumber}>{formatTime(gameStats.totalTimeSpent)}</Text>
                <Text style={styles.statLabel}>Time Played</Text>
              </View>
              <View style={styles.statCard}>
                <Trophy size={20} color="#F97316" strokeWidth={2} />
                <Text style={styles.statNumber}>{gameStats.bestScore}</Text>
                <Text style={styles.statLabel}>Best Score</Text>
              </View>
              <View style={styles.statCard}>
                <Zap size={20} color="#EF4444" strokeWidth={2} />
                <Text style={styles.statNumber}>{gameStats.currentStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </View>
        )}

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonSelected
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Games Grid */}
        <View style={styles.gamesSection}>
          <View style={styles.gamesSectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'All Games' : selectedCategory}
            </Text>
            <Text style={styles.gamesCount}>{filteredGames.length} games</Text>
          </View>

          {filteredGames.length === 0 ? (
            <View style={styles.noGamesContainer}>
              <Gamepad2 size={48} color="#9CA3AF" strokeWidth={1.5} />
              <Text style={styles.noGamesTitle}>No Games Available</Text>
              <Text style={styles.noGamesDescription}>
                Games for this category will be available soon.
              </Text>
            </View>
          ) : (
            <View style={styles.gamesGrid}>
              {filteredGames.map((game) => (
                <View key={game.id} style={styles.gameCard}>
                  <Image
                    source={{ uri: game.imageUrl }}
                    style={styles.gameImage}
                    resizeMode="cover"
                  />
                  
                  {game.isLocked && (
                    <View style={styles.lockedOverlay}>
                      <View style={styles.lockedBadge}>
                        <Target size={16} color="white" strokeWidth={2} />
                        <Text style={styles.lockedText}>Level {game.requiredLevel}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.gameContent}>
                    <View style={styles.gameHeader}>
                      <Text style={styles.gameTitle} numberOfLines={2}>
                        {game.title}
                      </Text>
                      <View style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(game.difficulty) }
                      ]}>
                        <Text style={styles.difficultyText}>{game.difficulty}</Text>
                      </View>
                    </View>

                    <Text style={styles.gameDescription} numberOfLines={3}>
                      {game.description}
                    </Text>

                    <View style={styles.gameMeta}>
                      <View style={styles.metaItem}>
                        <Clock size={14} color="#6B7280" strokeWidth={2} />
                        <Text style={styles.metaText}>{game.estimatedTime} min</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Brain size={14} color="#6B7280" strokeWidth={2} />
                        <Text style={styles.metaText}>{game.category}</Text>
                      </View>
                    </View>

                    <View style={styles.skillsContainer}>
                      <Text style={styles.skillsTitle}>Skills:</Text>
                      <View style={styles.skillsTags}>
                        {game.skills.slice(0, 2).map((skill, index) => (
                          <View key={index} style={styles.skillTag}>
                            <Text style={styles.skillTagText}>{skill}</Text>
                          </View>
                        ))}
                        {game.skills.length > 2 && (
                          <Text style={styles.moreSkills}>+{game.skills.length - 2} more</Text>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.playButton,
                        game.isLocked && styles.playButtonLocked
                      ]}
                      onPress={() => handlePlayGame(game)}
                      accessibilityRole="button"
                      accessibilityLabel={`Play ${game.title}`}
                    >
                      <Play size={20} color="white" strokeWidth={2} />
                      <Text style={styles.playButtonText}>
                        {game.isLocked ? 'Locked' : 'Play Now'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Score History */}
        {gameScores.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historySectionHeader}>
              <Text style={styles.sectionTitle}>🏆 Recent Scores</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push('/score-history')}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color="#8B5CF6" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {gameScores.slice(0, 5).map((score) => {
                const game = games.find(g => g.id === score.gameId);
                if (!game) return null;

                return (
                  <View key={score.id} style={styles.scoreCard}>
                    <View style={styles.scoreHeader}>
                      <Text style={styles.scoreGameTitle} numberOfLines={1}>
                        {game.title}
                      </Text>
                      <View style={styles.scoreDate}>
                        <Calendar size={12} color="#6B7280" strokeWidth={2} />
                        <Text style={styles.scoreDateText}>
                          {score.completedAt.toLocaleDateString()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.scoreMain}>
                      <Text style={styles.scoreNumber}>{score.score}</Text>
                      <Text style={styles.scoreMax}>/ {score.maxScore}</Text>
                    </View>

                    <View style={styles.scoreFooter}>
                      <View style={styles.scoreTime}>
                        <Clock size={12} color="#6B7280" strokeWidth={2} />
                        <Text style={styles.scoreTimeText}>
                          {formatTime(score.timeSpent)}
                        </Text>
                      </View>
                      {score.achievements.length > 0 && (
                        <View style={styles.scoreAchievements}>
                          <Medal size={12} color="#F97316" strokeWidth={2} />
                          <Text style={styles.scoreAchievementsText}>
                            {score.achievements.length}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/score-history')}
              accessibilityRole="button"
              accessibilityLabel="View score history"
            >
              <TrendingUp size={24} color="#10B981" strokeWidth={2} />
              <Text style={styles.quickActionText}>Score History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/achievements')}
              accessibilityRole="button"
              accessibilityLabel="View achievements"
            >
              <Award size={24} color="#F97316" strokeWidth={2} />
              <Text style={styles.quickActionText}>Achievements</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleRefresh()}
              accessibilityRole="button"
              accessibilityLabel="Refresh games"
            >
              <RotateCcw size={24} color="#8B5CF6" strokeWidth={2} />
              <Text style={styles.quickActionText}>Refresh</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/child-profiles')}
              accessibilityRole="button"
              accessibilityLabel="Manage profiles"
            >
              <Users size={24} color="#EF4444" strokeWidth={2} />
              <Text style={styles.quickActionText}>Profiles</Text>
            </TouchableOpacity>
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
    backgroundColor: '#8B5CF6',
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
  profileButton: {
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
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
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
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  categoryText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#6B7280',
  },
  categoryTextSelected: {
    color: 'white',
  },
  gamesSection: {
    marginBottom: 30,
  },
  gamesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gamesCount: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  noGamesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noGamesTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noGamesDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  gamesGrid: {
    gap: 16,
  },
  gameCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  gameImage: {
    width: '100%',
    height: 180,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  lockedText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: 'white',
  },
  gameContent: {
    padding: 20,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gameTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
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
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    color: 'white',
  },
  gameDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  gameMeta: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  skillsContainer: {
    marginBottom: 20,
  },
  skillsTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#374151',
    marginBottom: 8,
  },
  skillsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  skillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  skillTagText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
    color: '#6B7280',
  },
  moreSkills: {
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
    color: '#8B5CF6',
    fontStyle: 'italic',
  },
  playButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  playButtonLocked: {
    backgroundColor: '#9CA3AF',
  },
  playButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  historySection: {
    marginBottom: 30,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#8B5CF6',
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 160,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  scoreHeader: {
    marginBottom: 12,
  },
  scoreGameTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  scoreDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreDateText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
    color: '#6B7280',
  },
  scoreMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  scoreNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#8B5CF6',
  },
  scoreMax: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  scoreFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreTimeText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
    color: '#6B7280',
  },
  scoreAchievements: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreAchievementsText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    color: '#F97316',
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
});
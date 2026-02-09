import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Trophy, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Award,
  Medal,
  Star,
  Filter,
  Download
} from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import LoadingSpinner from '@/components/LoadingSpinner';

interface GameScore {
  id: string;
  gameId: string;
  childId: string;
  score: number;
  maxScore: number;
  timeSpent: number;
  completedAt: Date;
  difficulty: string;
  achievements: string[];
  gameName?: string;
}

interface ScoreStats {
  totalGames: number;
  averageScore: number;
  bestScore: number;
  totalTime: number;
  improvementRate: number;
}

const GAMES_MAP = {
  'math-adventure': 'Math Adventure Quest',
  'word-wizard': 'Word Wizard Academy',
  'science-lab': 'Science Lab Explorer',
  'geography-explorer': 'Geography Explorer'
};

export default function ScoreHistoryScreen() {
  const { user } = useAuth();
  const [scores, setScores] = useState<GameScore[]>([]);
  const [stats, setStats] = useState<ScoreStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all');

  const filters = ['all', 'math-adventure', 'word-wizard', 'science-lab', 'geography-explorer'];
  const timeRanges = [
    { key: 'all', label: 'All Time' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' }
  ];

  useEffect(() => {
    if (user) {
      loadScores();
    }
  }, [user, selectedFilter, selectedTimeRange]);

  const loadScores = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      let q = query(
        collection(db, 'gameScores'),
        where('childId', '==', user.uid), // In real app, this would be selected child ID
        orderBy('completedAt', 'desc')
      );

      // Apply time range filter
      if (selectedTimeRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (selectedTimeRange) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        q = query(q, where('completedAt', '>=', startDate));
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const scoresData: GameScore[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          scoresData.push({
            id: doc.id,
            ...data,
            completedAt: data.completedAt?.toDate() || new Date(),
            gameName: GAMES_MAP[data.gameId as keyof typeof GAMES_MAP] || data.gameId,
          } as GameScore);
        });

        // Apply game filter
        const filteredScores = selectedFilter === 'all' 
          ? scoresData 
          : scoresData.filter(score => score.gameId === selectedFilter);

        setScores(filteredScores);
        calculateStats(filteredScores);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error loading scores:', error);
      setLoading(false);
    }
  };

  const calculateStats = (scoresData: GameScore[]) => {
    if (scoresData.length === 0) {
      setStats({
        totalGames: 0,
        averageScore: 0,
        bestScore: 0,
        totalTime: 0,
        improvementRate: 0
      });
      return;
    }

    const totalGames = scoresData.length;
    const averageScore = Math.round(
      scoresData.reduce((sum, score) => sum + score.score, 0) / totalGames
    );
    const bestScore = Math.max(...scoresData.map(score => score.score));
    const totalTime = scoresData.reduce((sum, score) => sum + score.timeSpent, 0);

    // Calculate improvement rate (comparing first half vs second half of scores)
    let improvementRate = 0;
    if (totalGames >= 4) {
      const halfPoint = Math.floor(totalGames / 2);
      const recentScores = scoresData.slice(0, halfPoint);
      const olderScores = scoresData.slice(halfPoint);
      
      const recentAvg = recentScores.reduce((sum, score) => sum + score.score, 0) / recentScores.length;
      const olderAvg = olderScores.reduce((sum, score) => sum + score.score, 0) / olderScores.length;
      
      improvementRate = Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
    }

    setStats({
      totalGames,
      averageScore,
      bestScore,
      totalTime,
      improvementRate
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadScores();
    setRefreshing(false);
  };

  const handleExport = () => {
    Alert.alert(
      'Export Scores',
      'Export your score history to share with teachers or track progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export CSV', onPress: () => exportToCSV() },
        { text: 'Export PDF', onPress: () => exportToPDF() }
      ]
    );
  };

  const exportToCSV = () => {
    // In a real app, this would generate and download a CSV file
    Alert.alert('Export', 'CSV export feature will be available in the next update!');
  };

  const exportToPDF = () => {
    // In a real app, this would generate and download a PDF report
    Alert.alert('Export', 'PDF export feature will be available in the next update!');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime12Hour = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return '#10B981';
    if (percentage >= 70) return '#F97316';
    if (percentage >= 50) return '#EF4444';
    return '#6B7280';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F97316';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (loading && scores.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={32} color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading score history...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Score History</Text>
          <Text style={styles.headerSubtitle}>Track your gaming progress</Text>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleExport}
          accessibilityRole="button"
          accessibilityLabel="Export scores"
        >
          <Download size={20} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Stats Overview */}
        {stats && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>📊 Performance Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Trophy size={20} color="#F97316" strokeWidth={2} />
                <Text style={styles.statNumber}>{stats.bestScore}</Text>
                <Text style={styles.statLabel}>Best Score</Text>
              </View>
              <View style={styles.statCard}>
                <Target size={20} color="#8B5CF6" strokeWidth={2} />
                <Text style={styles.statNumber}>{stats.averageScore}</Text>
                <Text style={styles.statLabel}>Average</Text>
              </View>
              <View style={styles.statCard}>
                <Clock size={20} color="#10B981" strokeWidth={2} />
                <Text style={styles.statNumber}>{formatTime(stats.totalTime)}</Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>
              <View style={styles.statCard}>
                <TrendingUp size={20} color={stats.improvementRate >= 0 ? '#10B981' : '#EF4444'} strokeWidth={2} />
                <Text style={[
                  styles.statNumber,
                  { color: stats.improvementRate >= 0 ? '#10B981' : '#EF4444' }
                ]}>
                  {stats.improvementRate >= 0 ? '+' : ''}{stats.improvementRate}%
                </Text>
                <Text style={styles.statLabel}>Improvement</Text>
              </View>
            </View>
          </View>
        )}

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Game</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter && styles.filterButtonSelected
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[
                    styles.filterText,
                    selectedFilter === filter && styles.filterTextSelected
                  ]}>
                    {filter === 'all' ? 'All Games' : GAMES_MAP[filter as keyof typeof GAMES_MAP]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Time Range</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {timeRanges.map((range) => (
                <TouchableOpacity
                  key={range.key}
                  style={[
                    styles.filterButton,
                    selectedTimeRange === range.key && styles.filterButtonSelected
                  ]}
                  onPress={() => setSelectedTimeRange(range.key)}
                >
                  <Text style={[
                    styles.filterText,
                    selectedTimeRange === range.key && styles.filterTextSelected
                  ]}>
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Scores List */}
        <View style={styles.scoresSection}>
          <View style={styles.scoresSectionHeader}>
            <Text style={styles.sectionTitle}>Game Scores</Text>
            <Text style={styles.scoresCount}>{scores.length} games</Text>
          </View>

          {scores.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Trophy size={48} color="#9CA3AF" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No Scores Yet</Text>
              <Text style={styles.emptyDescription}>
                Start playing games to see your scores and track your progress!
              </Text>
              <TouchableOpacity
                style={styles.playGamesButton}
                onPress={() => router.push('/(tabs)/games')}
              >
                <Text style={styles.playGamesButtonText}>Play Games</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.scoresList}>
              {scores.map((score) => (
                <View key={score.id} style={styles.scoreItem}>
                  <View style={styles.scoreHeader}>
                    <View style={styles.scoreGameInfo}>
                      <Text style={styles.scoreGameName} numberOfLines={1}>
                        {score.gameName}
                      </Text>
                      <View style={styles.scoreMetaRow}>
                        <View style={styles.scoreDateContainer}>
                          <Calendar size={12} color="#6B7280" strokeWidth={2} />
                          <Text style={styles.scoreDateText}>
                            {formatDate(score.completedAt)}
                          </Text>
                        </View>
                        <View style={styles.scoreTimeContainer}>
                          <Clock size={12} color="#6B7280" strokeWidth={2} />
                          <Text style={styles.scoreTimeText}>
                            {formatTime12Hour(score.completedAt)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(score.difficulty) }
                    ]}>
                      <Text style={styles.difficultyText}>{score.difficulty}</Text>
                    </View>
                  </View>

                  <View style={styles.scoreMain}>
                    <View style={styles.scoreNumbers}>
                      <Text style={[
                        styles.scoreValue,
                        { color: getScoreColor(score.score, score.maxScore) }
                      ]}>
                        {score.score}
                      </Text>
                      <Text style={styles.scoreMax}>/ {score.maxScore}</Text>
                      <Text style={styles.scorePercentage}>
                        ({Math.round((score.score / score.maxScore) * 100)}%)
                      </Text>
                    </View>

                    <View style={styles.scoreDetails}>
                      <View style={styles.scoreDetailItem}>
                        <Clock size={14} color="#6B7280" strokeWidth={2} />
                        <Text style={styles.scoreDetailText}>
                          {formatTime(score.timeSpent)}
                        </Text>
                      </View>
                      
                      {score.achievements.length > 0 && (
                        <View style={styles.scoreDetailItem}>
                          <Medal size={14} color="#F97316" strokeWidth={2} />
                          <Text style={styles.scoreDetailText}>
                            {score.achievements.length} achievement{score.achievements.length !== 1 ? 's' : ''}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {score.achievements.length > 0 && (
                    <View style={styles.achievementsContainer}>
                      <Text style={styles.achievementsTitle}>🏆 Achievements:</Text>
                      <View style={styles.achievementsList}>
                        {score.achievements.map((achievement, index) => (
                          <View key={index} style={styles.achievementTag}>
                            <Star size={12} color="#F97316" strokeWidth={2} fill="#F97316" />
                            <Text style={styles.achievementText}>{achievement}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
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
    fontSize: 18,
    color: '#1F2937',
  },
  headerSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
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
    fontSize: 18,
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
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#8B5CF6',
  },
  filterText: {
    fontFamily: 'Nunito-Medium',
    fontSize: 12,
    color: '#6B7280',
  },
  filterTextSelected: {
    color: 'white',
  },
  scoresSection: {
    marginBottom: 30,
  },
  scoresSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
  },
  scoresCount: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 16,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  playGamesButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  playGamesButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  scoresList: {
    gap: 12,
  },
  scoreItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scoreGameInfo: {
    flex: 1,
  },
  scoreGameName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  scoreMetaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scoreDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreDateText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  scoreTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreTimeText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
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
  scoreMain: {
    marginBottom: 12,
  },
  scoreNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    marginRight: 4,
  },
  scoreMax: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginRight: 8,
  },
  scorePercentage: {
    fontFamily: 'Nunito-Medium',
    fontSize: 14,
    color: '#8B5CF6',
  },
  scoreDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  scoreDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreDetailText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
  },
  achievementsTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#92400E',
    marginBottom: 8,
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  achievementTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  achievementText: {
    fontFamily: 'Nunito-Medium',
    fontSize: 10,
    color: '#92400E',
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CircleCheck as CheckCircle, Circle as XCircle, Brain, Trophy, RotateCcw, ArrowRight, Clock, Target, Zap, Award } from 'lucide-react-native';
import LoadingSpinner from '@/components/LoadingSpinner';

const { width: screenWidth } = Dimensions.get('window');

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  hint?: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  grade: string;
  totalPoints: number;
  achievements: string[];
}

// Mock quiz data - In production, this would come from Firebase Storage
const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is 2 + 3?',
    options: ['4', '5', '6', '7'],
    correctAnswer: 1,
    explanation: 'When we add 2 + 3, we count forward 3 steps from 2: 3, 4, 5. So 2 + 3 = 5! 🎉',
    difficulty: 'Easy',
    points: 10,
    hint: 'Try counting on your fingers!'
  },
  {
    id: '2',
    question: 'If you have 1 toy car and get 2 more, how many toy cars do you have?',
    options: ['2', '3', '4', '1'],
    correctAnswer: 1,
    explanation: 'You start with 1 toy car and get 2 more: 1 + 2 = 3 toy cars! 🚗🚗🚗',
    difficulty: 'Easy',
    points: 10,
    hint: 'Think about adding the cars together!'
  },
  {
    id: '3',
    question: 'What symbol do we use to show addition?',
    options: ['-', '+', '=', '×'],
    correctAnswer: 1,
    explanation: 'The plus sign (+) is the symbol we use to show addition. It means "put together"! ➕',
    difficulty: 'Easy',
    points: 15,
    hint: 'It looks like a cross!'
  },
  {
    id: '4',
    question: 'What is 4 + 1?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 2,
    explanation: 'When we add 4 + 1, we get 5. You can count: 4, then one more makes 5! ✋',
    difficulty: 'Easy',
    points: 10,
    hint: 'Start with 4 and add 1 more!'
  },
  {
    id: '5',
    question: 'If you have 3 apples and someone gives you 2 more apples, how many apples do you have in total?',
    options: ['4', '5', '6', '3'],
    correctAnswer: 1,
    explanation: 'You start with 3 apples and get 2 more: 3 + 2 = 5 apples total! 🍎🍎🍎🍎🍎',
    difficulty: 'Medium',
    points: 20,
    hint: 'Count all the apples together!'
  },
  {
    id: '6',
    question: 'What is the answer called when you add two numbers together?',
    options: ['Product', 'Sum', 'Difference', 'Quotient'],
    correctAnswer: 1,
    explanation: 'The answer you get when adding numbers is called the "sum". For example, in 2 + 3 = 5, the sum is 5! 📊',
    difficulty: 'Medium',
    points: 25,
    hint: 'It starts with the letter "S"!'
  },
  {
    id: '7',
    question: 'Using a number line, if you start at 6 and jump forward 3 spaces, where do you land?',
    options: ['8', '9', '10', '7'],
    correctAnswer: 1,
    explanation: 'Starting at 6 and jumping forward 3 spaces: 6 → 7 → 8 → 9. You land on 9! 🦘',
    difficulty: 'Medium',
    points: 20,
    hint: 'Count the jumps: 7, 8, 9!'
  },
  {
    id: '8',
    question: 'What is 5 + 4?',
    options: ['8', '9', '10', '7'],
    correctAnswer: 1,
    explanation: 'When we add 5 + 4, we get 9. You can use your fingers or count forward from 5! 🖐️✋',
    difficulty: 'Medium',
    points: 15,
    hint: 'Use both hands to help you count!'
  }
];

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    loadQuizQuestions();
    
    // Timer for tracking time spent
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const loadQuizQuestions = async () => {
    try {
      setLoading(true);
      
      // In production, this would fetch from Firebase Storage
      // const quizRef = ref(storage, `quizzes/${params.lessonId}/questions.json`);
      // const downloadURL = await getDownloadURL(quizRef);
      // const response = await fetch(downloadURL);
      // const quizData = await response.json();
      
      // For demo, we'll use mock data
      setQuestions(MOCK_QUIZ_QUESTIONS);
      setUserAnswers(new Array(MOCK_QUIZ_QUESTIONS.length).fill(null));
      setStartTime(new Date());
    } catch (error) {
      console.error('Error loading quiz questions:', error);
      Alert.alert('Error', 'Failed to load quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      Alert.alert('Please select an answer', 'Choose an option before continuing.');
      return;
    }

    if (showExplanation) {
      // Move to next question
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(userAnswers[currentQuestion + 1]);
        setShowExplanation(false);
        setShowHint(false);
      } else {
        // Quiz completed
        setQuizCompleted(true);
      }
    } else {
      // Show explanation
      setShowExplanation(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1]);
      setShowExplanation(false);
      setShowHint(false);
    }
  };

  const calculateResults = (): QuizResult => {
    const correctAnswers = userAnswers.reduce((count, answer, index) => {
      return answer === questions[index].correctAnswer ? count + 1 : count;
    }, 0);

    const totalPoints = userAnswers.reduce((points, answer, index) => {
      return answer === questions[index].correctAnswer ? points + questions[index].points : points;
    }, 0);

    const score = Math.round((correctAnswers / questions.length) * 100);
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60); // in minutes

    let grade = 'F';
    if (score >= 90) grade = 'A+';
    else if (score >= 85) grade = 'A';
    else if (score >= 80) grade = 'B+';
    else if (score >= 75) grade = 'B';
    else if (score >= 70) grade = 'C+';
    else if (score >= 65) grade = 'C';
    else if (score >= 60) grade = 'D';

    // Calculate achievements
    const achievements = [];
    if (score === 100) achievements.push('Perfect Score! 🏆');
    if (score >= 90) achievements.push('Math Genius! 🧠');
    if (timeSpent <= 5) achievements.push('Speed Demon! ⚡');
    if (correctAnswers >= 5) achievements.push('Addition Master! ➕');
    if (achievements.length === 0) achievements.push('Keep Practicing! 💪');

    return {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent,
      grade,
      totalPoints,
      achievements
    };
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers(new Array(questions.length).fill(null));
    setShowExplanation(false);
    setShowHint(false);
    setQuizCompleted(false);
    setStartTime(new Date());
    setTimeElapsed(0);
  };

  const handleFinishQuiz = () => {
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F97316';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={32} color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (quizCompleted) {
    const results = calculateResults();
    
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Trophy size={64} color="#F97316" strokeWidth={2} />
              <Text style={styles.resultsTitle}>Quiz Complete! 🎉</Text>
              <Text style={styles.resultsSubtitle}>Amazing work on completing the quiz!</Text>
            </View>

            <View style={styles.scoreCard}>
              <View style={styles.scoreMain}>
                <Text style={styles.scoreNumber}>{results.score}%</Text>
                <Text style={styles.scoreGrade}>Grade: {results.grade}</Text>
              </View>
              
              <View style={styles.scoreDetails}>
                <View style={styles.scoreDetailItem}>
                  <CheckCircle size={20} color="#10B981" strokeWidth={2} />
                  <Text style={styles.scoreDetailNumber}>{results.correctAnswers}</Text>
                  <Text style={styles.scoreDetailLabel}>Correct</Text>
                </View>
                <View style={styles.scoreDetailItem}>
                  <XCircle size={20} color="#EF4444" strokeWidth={2} />
                  <Text style={styles.scoreDetailNumber}>{results.totalQuestions - results.correctAnswers}</Text>
                  <Text style={styles.scoreDetailLabel}>Incorrect</Text>
                </View>
                <View style={styles.scoreDetailItem}>
                  <Clock size={20} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.scoreDetailNumber}>{results.timeSpent}</Text>
                  <Text style={styles.scoreDetailLabel}>Minutes</Text>
                </View>
                <View style={styles.scoreDetailItem}>
                  <Zap size={20} color="#F97316" strokeWidth={2} />
                  <Text style={styles.scoreDetailNumber}>{results.totalPoints}</Text>
                  <Text style={styles.scoreDetailLabel}>Points</Text>
                </View>
              </View>
            </View>

            {/* Achievements */}
            <View style={styles.achievementsContainer}>
              <Text style={styles.achievementsTitle}>🏆 Achievements Unlocked</Text>
              {results.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <Award size={16} color="#F97316" strokeWidth={2} />
                  <Text style={styles.achievementText}>{achievement}</Text>
                </View>
              ))}
            </View>

            {/* Performance Breakdown */}
            <View style={styles.breakdownContainer}>
              <Text style={styles.breakdownTitle}>📊 Performance Breakdown</Text>
              {questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                return (
                  <View key={index} style={styles.breakdownItem}>
                    <View style={styles.breakdownHeader}>
                      <Text style={styles.breakdownQuestion}>Q{index + 1}</Text>
                      {isCorrect ? (
                        <CheckCircle size={16} color="#10B981" strokeWidth={2} />
                      ) : (
                        <XCircle size={16} color="#EF4444" strokeWidth={2} />
                      )}
                      <Text style={[
                        styles.breakdownPoints,
                        { color: isCorrect ? '#10B981' : '#EF4444' }
                      ]}>
                        {isCorrect ? `+${question.points}` : '0'} pts
                      </Text>
                    </View>
                    <Text style={styles.breakdownText} numberOfLines={2}>
                      {question.question}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.resultsActions}>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={handleRetakeQuiz}
                accessibilityRole="button"
                accessibilityLabel="Retake quiz"
              >
                <RotateCcw size={20} color="#8B5CF6" strokeWidth={2} />
                <Text style={styles.retakeButtonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.finishButton}
                onPress={handleFinishQuiz}
                accessibilityRole="button"
                accessibilityLabel="Finish quiz"
              >
                <Text style={styles.finishButtonText}>Continue Learning</Text>
                <ArrowRight size={20} color="white" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQ = questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

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
          <Text style={styles.headerTitle}>Quiz: {params.title}</Text>
          <Text style={styles.headerSubtitle}>
            Question {currentQuestion + 1} of {questions.length} • {formatTime(timeElapsed)}
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Brain size={24} color="#8B5CF6" strokeWidth={2} />
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill, 
            { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
          ]} />
        </View>
        <Text style={styles.progressText}>
          {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Question */}
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Question {currentQuestion + 1}</Text>
            <View style={styles.questionMeta}>
              <View style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(currentQ.difficulty) }
              ]}>
                <Text style={styles.difficultyText}>{currentQ.difficulty}</Text>
              </View>
              <View style={styles.pointsBadge}>
                <Target size={12} color="#F97316" strokeWidth={2} />
                <Text style={styles.pointsText}>{currentQ.points} pts</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.questionText}>{currentQ.question}</Text>
          
          {/* Hint Button */}
          {currentQ.hint && !showExplanation && (
            <TouchableOpacity
              style={styles.hintButton}
              onPress={() => setShowHint(!showHint)}
              accessibilityRole="button"
              accessibilityLabel="Show hint"
            >
              <Text style={styles.hintButtonText}>
                {showHint ? '🙈 Hide Hint' : '💡 Need a Hint?'}
              </Text>
            </TouchableOpacity>
          )}
          
          {/* Hint Display */}
          {showHint && currentQ.hint && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>💡 {currentQ.hint}</Text>
            </View>
          )}
        </View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {currentQ.options.map((option, index) => {
            let optionStyle = styles.optionButton;
            let textStyle = styles.optionText;
            let iconComponent = null;

            if (showExplanation) {
              if (index === currentQ.correctAnswer) {
                optionStyle = [styles.optionButton, styles.optionCorrect];
                textStyle = [styles.optionText, styles.optionTextCorrect];
                iconComponent = <CheckCircle size={20} color="#10B981" strokeWidth={2} />;
              } else if (index === selectedAnswer && selectedAnswer !== currentQ.correctAnswer) {
                optionStyle = [styles.optionButton, styles.optionIncorrect];
                textStyle = [styles.optionText, styles.optionTextIncorrect];
                iconComponent = <XCircle size={20} color="#EF4444" strokeWidth={2} />;
              }
            } else if (selectedAnswer === index) {
              optionStyle = [styles.optionButton, styles.optionSelected];
              textStyle = [styles.optionText, styles.optionTextSelected];
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => !showExplanation && handleAnswerSelect(index)}
                disabled={showExplanation}
                accessibilityRole="button"
                accessibilityLabel={`Option ${index + 1}: ${option}`}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionLetter,
                    selectedAnswer === index && !showExplanation && styles.optionLetterSelected,
                    showExplanation && index === currentQ.correctAnswer && styles.optionLetterCorrect,
                    showExplanation && index === selectedAnswer && selectedAnswer !== currentQ.correctAnswer && styles.optionLetterIncorrect
                  ]}>
                    <Text style={[
                      styles.optionLetterText,
                      selectedAnswer === index && !showExplanation && styles.optionLetterTextSelected,
                      showExplanation && index === currentQ.correctAnswer && styles.optionLetterTextCorrect,
                      showExplanation && index === selectedAnswer && selectedAnswer !== currentQ.correctAnswer && styles.optionLetterTextIncorrect
                    ]}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={textStyle}>{option}</Text>
                </View>
                {iconComponent}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {showExplanation && (
          <View style={styles.explanationContainer}>
            <View style={styles.explanationHeader}>
              {isCorrect ? (
                <CheckCircle size={24} color="#10B981" strokeWidth={2} />
              ) : (
                <XCircle size={24} color="#EF4444" strokeWidth={2} />
              )}
              <Text style={[
                styles.explanationTitle,
                { color: isCorrect ? '#10B981' : '#EF4444' }
              ]}>
                {isCorrect ? 'Excellent! 🎉' : 'Not quite right 🤔'}
              </Text>
              {isCorrect && (
                <View style={styles.pointsEarned}>
                  <Text style={styles.pointsEarnedText}>+{currentQ.points} points!</Text>
                </View>
              )}
            </View>
            <Text style={styles.explanationText}>{currentQ.explanation}</Text>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            accessibilityRole="button"
            accessibilityLabel="Previous question"
          >
            <ArrowLeft size={20} color={currentQuestion === 0 ? "#9CA3AF" : "#8B5CF6"} strokeWidth={2} />
            <Text style={[styles.navButtonText, currentQuestion === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, selectedAnswer === null && styles.nextButtonDisabled]}
            onPress={handleNextQuestion}
            disabled={selectedAnswer === null}
            accessibilityRole="button"
            accessibilityLabel={showExplanation ? (currentQuestion === questions.length - 1 ? "Finish quiz" : "Next question") : "Check answer"}
          >
            <Text style={styles.nextButtonText}>
              {showExplanation 
                ? (currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question')
                : 'Check Answer'
              }
            </Text>
            <ArrowRight size={20} color="white" strokeWidth={2} />
          </TouchableOpacity>
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
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#8B5CF6',
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
  questionContainer: {
    backgroundColor: 'white',
    padding: 24,
    marginTop: 8,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#8B5CF6',
  },
  questionMeta: {
    flexDirection: 'row',
    gap: 8,
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
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  pointsText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    color: '#F97316',
  },
  questionText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    lineHeight: 28,
    marginBottom: 16,
  },
  hintButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  hintButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#4F46E5',
  },
  hintContainer: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  hintText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#92400E',
    fontStyle: 'italic',
  },
  optionsContainer: {
    padding: 20,
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3E8FF',
  },
  optionCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionIncorrect: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionLetterSelected: {
    backgroundColor: '#8B5CF6',
  },
  optionLetterCorrect: {
    backgroundColor: '#10B981',
  },
  optionLetterIncorrect: {
    backgroundColor: '#EF4444',
  },
  optionLetterText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#6B7280',
  },
  optionLetterTextSelected: {
    color: 'white',
  },
  optionLetterTextCorrect: {
    color: 'white',
  },
  optionLetterTextIncorrect: {
    color: 'white',
  },
  optionText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  optionTextSelected: {
    color: '#8B5CF6',
    fontFamily: 'Nunito-SemiBold',
  },
  optionTextCorrect: {
    color: '#10B981',
    fontFamily: 'Nunito-SemiBold',
  },
  optionTextIncorrect: {
    color: '#EF4444',
    fontFamily: 'Nunito-SemiBold',
  },
  explanationContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  explanationTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    flex: 1,
  },
  pointsEarned: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsEarnedText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#10B981',
  },
  explanationText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#8B5CF6',
  },
  navButtonTextDisabled: {
    color: '#9CA3AF',
  },
  nextButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  // Results styles
  resultsContainer: {
    padding: 20,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  resultsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreMain: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 48,
    color: '#8B5CF6',
    marginBottom: 8,
  },
  scoreGrade: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 18,
    color: '#1F2937',
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreDetailItem: {
    alignItems: 'center',
    gap: 4,
  },
  scoreDetailNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#1F2937',
  },
  scoreDetailLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  achievementsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  achievementText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#92400E',
  },
  breakdownContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  breakdownTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  breakdownItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 12,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  breakdownQuestion: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  breakdownPoints: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
  },
  breakdownText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#374151',
  },
  resultsActions: {
    gap: 12,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    gap: 8,
  },
  retakeButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: '#8B5CF6',
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  finishButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});
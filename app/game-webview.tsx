import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, RotateCcw, Share, Chrome as Home, Trophy } from 'lucide-react-native';
import { doc, updateDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

interface GameMessage {
  type: 'score' | 'progress' | 'achievement' | 'complete';
  data: any;
}

export default function GameWebViewScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [gameStartTime] = useState(new Date());
  const [currentScore, setCurrentScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const gameId = params.gameId as string;
  const gameUrl = params.gameUrl as string;
  const title = params.title as string;
  const sessionId = params.sessionId as string;

  useEffect(() => {
    // Track game session start
    if (sessionId && user) {
      updateGameSession('started');
    }

    return () => {
      // Track game session end when component unmounts
      if (sessionId && user && !gameCompleted) {
        updateGameSession('abandoned');
      }
    };
  }, []);

  const updateGameSession = async (status: string) => {
    if (!sessionId || !user) return;

    try {
      const sessionRef = doc(db, 'gameSessions', sessionId);
      await updateDoc(sessionRef, {
        status,
        lastUpdated: new Date(),
        ...(status === 'completed' && {
          completedAt: new Date(),
          finalScore: currentScore,
          timeSpent: Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000)
        })
      });
    } catch (error) {
      console.error('Error updating game session:', error);
    }
  };

  const handleGameMessage = async (message: GameMessage) => {
    switch (message.type) {
      case 'score':
        setCurrentScore(message.data.score);
        break;
      
      case 'progress':
        // Handle progress updates
        console.log('Game progress:', message.data);
        break;
      
      case 'achievement':
        // Handle achievement unlocks
        Alert.alert(
          'Achievement Unlocked! 🏆',
          message.data.title,
          [{ text: 'Awesome!' }]
        );
        break;
      
      case 'complete':
        await handleGameComplete(message.data);
        break;
    }
  };

  const handleGameComplete = async (gameData: any) => {
    setGameCompleted(true);
    
    if (!user || !gameId) return;

    try {
      const timeSpent = Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000);
      
      // Save game score to Firestore
      const scoreRef = doc(collection(db, 'gameScores'));
      await setDoc(scoreRef, {
        gameId,
        childId: user.uid, // In a real app, this would be the selected child's ID
        score: gameData.score || currentScore,
        maxScore: gameData.maxScore || 1000,
        timeSpent,
        completedAt: new Date(),
        difficulty: gameData.difficulty || 'Medium',
        achievements: gameData.achievements || [],
        sessionId
      });

      // Update game session
      await updateGameSession('completed');

      // Show completion dialog
      Alert.alert(
        'Game Complete! 🎉',
        `Great job! You scored ${gameData.score || currentScore} points in ${Math.floor(timeSpent / 60)} minutes.`,
        [
          { text: 'Play Again', onPress: () => handleRestart() },
          { text: 'Back to Games', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      console.error('Error saving game score:', error);
      Alert.alert('Error', 'Failed to save your score. Please try again.');
    }
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      handleGameMessage(message);
    } catch (error) {
      console.error('Error parsing game message:', error);
    }
  };

  const handleRestart = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
      setCurrentScore(0);
      setGameCompleted(false);
    }
  };

  const handleShare = () => {
    if (Platform.OS === 'web') {
      if (navigator.share) {
        navigator.share({
          title: `Check out ${title}!`,
          text: `I just played ${title} and scored ${currentScore} points!`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        Alert.alert('Share', `I just played ${title} and scored ${currentScore} points!`);
      }
    } else {
      Alert.alert('Share', 'Sharing feature will be available in the mobile app.');
    }
  };

  const injectedJavaScript = `
    // Inject communication bridge for games
    window.gameAPI = {
      sendScore: function(score) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'score',
          data: { score: score }
        }));
      },
      sendProgress: function(progress) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'progress',
          data: progress
        }));
      },
      sendAchievement: function(achievement) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'achievement',
          data: achievement
        }));
      },
      gameComplete: function(gameData) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'complete',
          data: gameData
        }));
      }
    };
    
    // For demo purposes, simulate a simple math game
    if (window.location.pathname.includes('math-adventure')) {
      setTimeout(() => {
        window.gameAPI.sendScore(Math.floor(Math.random() * 500) + 200);
      }, 5000);
      
      setTimeout(() => {
        window.gameAPI.sendAchievement({
          title: 'Math Wizard!',
          description: 'Solved 10 problems correctly'
        });
      }, 10000);
      
      setTimeout(() => {
        window.gameAPI.gameComplete({
          score: Math.floor(Math.random() * 800) + 400,
          maxScore: 1000,
          difficulty: 'Easy',
          achievements: ['First Game', 'Math Wizard']
        });
      }, 15000);
    }
    
    true; // Required for injected JavaScript
  `;

  // For demo purposes, create a simple HTML game if no URL is provided
  const demoGameHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .game-container {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 40px;
                backdrop-filter: blur(10px);
                max-width: 400px;
                width: 100%;
            }
            .score {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .question {
                font-size: 32px;
                margin: 30px 0;
                padding: 20px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 15px;
            }
            .options {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 30px 0;
            }
            .option {
                padding: 15px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 10px;
                color: white;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .option:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
            }
            .correct {
                background: rgba(34, 197, 94, 0.8) !important;
            }
            .incorrect {
                background: rgba(239, 68, 68, 0.8) !important;
            }
            .progress {
                width: 100%;
                height: 10px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                margin-bottom: 20px;
                overflow: hidden;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #34d399);
                transition: width 0.5s ease;
            }
        </style>
    </head>
    <body>
        <div class="game-container">
            <div class="progress">
                <div class="progress-fill" id="progress" style="width: 0%"></div>
            </div>
            <div class="score">Score: <span id="score">0</span></div>
            <div class="question" id="question">Loading...</div>
            <div class="options" id="options"></div>
        </div>

        <script>
            let score = 0;
            let currentQuestion = 0;
            let totalQuestions = 10;
            let questions = [];

            // Generate random math questions
            function generateQuestions() {
                for (let i = 0; i < totalQuestions; i++) {
                    const a = Math.floor(Math.random() * 20) + 1;
                    const b = Math.floor(Math.random() * 20) + 1;
                    const correct = a + b;
                    const wrong1 = correct + Math.floor(Math.random() * 10) + 1;
                    const wrong2 = correct - Math.floor(Math.random() * 10) - 1;
                    const wrong3 = correct + Math.floor(Math.random() * 20) - 10;
                    
                    const options = [correct, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                    
                    questions.push({
                        question: \`\${a} + \${b} = ?\`,
                        options: options,
                        correct: correct
                    });
                }
            }

            function displayQuestion() {
                if (currentQuestion >= totalQuestions) {
                    endGame();
                    return;
                }

                const q = questions[currentQuestion];
                document.getElementById('question').textContent = q.question;
                
                const optionsContainer = document.getElementById('options');
                optionsContainer.innerHTML = '';
                
                q.options.forEach(option => {
                    const button = document.createElement('button');
                    button.className = 'option';
                    button.textContent = option;
                    button.onclick = () => selectAnswer(option, q.correct);
                    optionsContainer.appendChild(button);
                });

                // Update progress
                const progress = ((currentQuestion) / totalQuestions) * 100;
                document.getElementById('progress').style.width = progress + '%';
            }

            function selectAnswer(selected, correct) {
                const buttons = document.querySelectorAll('.option');
                buttons.forEach(button => {
                    button.disabled = true;
                    if (parseInt(button.textContent) === correct) {
                        button.classList.add('correct');
                    } else if (parseInt(button.textContent) === selected && selected !== correct) {
                        button.classList.add('incorrect');
                    }
                });

                if (selected === correct) {
                    score += 100;
                    document.getElementById('score').textContent = score;
                    
                    // Send score update to React Native
                    if (window.gameAPI) {
                        window.gameAPI.sendScore(score);
                    }
                }

                setTimeout(() => {
                    currentQuestion++;
                    displayQuestion();
                }, 1500);
            }

            function endGame() {
                document.getElementById('question').textContent = 'Game Complete! 🎉';
                document.getElementById('options').innerHTML = '<p style="grid-column: 1 / -1; font-size: 18px;">Final Score: ' + score + ' points</p>';
                
                // Update progress to 100%
                document.getElementById('progress').style.width = '100%';
                
                // Send completion to React Native
                if (window.gameAPI) {
                    window.gameAPI.gameComplete({
                        score: score,
                        maxScore: totalQuestions * 100,
                        difficulty: 'Easy',
                        achievements: score > 500 ? ['Math Star'] : []
                    });
                }
            }

            // Initialize game
            generateQuestions();
            displayQuestion();
        </script>
    </body>
    </html>
  `;

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
            {title}
          </Text>
          {currentScore > 0 && (
            <Text style={styles.headerScore}>Score: {currentScore}</Text>
          )}
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleRestart}
            accessibilityRole="button"
            accessibilityLabel="Restart game"
          >
            <RotateCcw size={20} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Share game"
          >
            <Share size={20} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Game WebView */}
      <View style={styles.gameContainer}>
        <WebView
          ref={webViewRef}
          source={gameUrl ? { uri: gameUrl } : { html: demoGameHTML }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onMessage={handleWebViewMessage}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <LoadingSpinner size={32} color="#8B5CF6" />
              <Text style={styles.loadingText}>Loading game...</Text>
            </View>
          )}
          onError={(error) => {
            console.error('WebView error:', error);
            Alert.alert('Error', 'Failed to load game. Please try again.');
          }}
        />
      </View>

      {/* Game Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => router.push('/(tabs)/games')}
          accessibilityRole="button"
          accessibilityLabel="Back to games"
        >
          <Home size={20} color="#8B5CF6" strokeWidth={2} />
          <Text style={styles.controlButtonText}>Games</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => router.push('/score-history')}
          accessibilityRole="button"
          accessibilityLabel="View scores"
        >
          <Trophy size={20} color="#F97316" strokeWidth={2} />
          <Text style={styles.controlButtonText}>Scores</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  headerScore: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#8B5CF6',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  gameContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  controlButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#374151',
  },
});
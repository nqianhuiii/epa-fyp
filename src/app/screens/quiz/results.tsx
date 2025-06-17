// screens/quiz/QuizResults.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useEffect } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useQuizStore } from '../../../store/quizStore';
import { Quiz } from '../../../types/QuizType';
import BackButton from '../../../components/custom/customBackButton';

const QuizResults = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    currentQuiz,
    currentAnswers,
    currentScore,
    attempts,
    getBestScore,
    getAverageScore,
    getTotalAttempts,
    clearCurrentQuiz,
  } = useQuizStore();

  // Safely parse quiz data with fallbacks
  const quiz: Quiz | null = useMemo(() => {
    // First try to get from store
    if (currentQuiz) return currentQuiz;
    
    // Then try to parse from params
    if (params.quiz) {
      try {
        let quizString = params.quiz as string;
        
        // Handle double-encoded JSON
        if (quizString.startsWith('"{') || quizString.startsWith('"[')) {
          quizString = JSON.parse(quizString);
        }
        
        return JSON.parse(quizString);
      } catch (error) {
        console.error('Error parsing quiz from params:', error);
        console.error('Quiz param value:', params.quiz);
        return null;
      }
    }
    
    return null;
  }, [currentQuiz, params.quiz]);

  // Safely parse user answers
  const userAnswers: number[] = useMemo(() => {
    // First try to get from store
    if (currentAnswers && currentAnswers.length > 0) return currentAnswers;
    
    // Then try to parse from params
    if (params.userAnswers) {
      try {
        return JSON.parse(params.userAnswers as string);
      } catch (error) {
        console.error('Error parsing userAnswers from params:', error);
        return [];
      }
    }
    
    return [];
  }, [currentAnswers, params.userAnswers]);

  // Safely parse score
  const score: number = useMemo(() => {
    // First try to get from store
    if (typeof currentScore === 'number') return currentScore;
    
    // Then try to parse from params
    if (params.score) {
      const parsedScore = parseInt(params.score as string);
      return isNaN(parsedScore) ? 0 : parsedScore;
    }
    
    return 0;
  }, [currentScore, params.score]);

  // Redirect if no quiz data is available
  useEffect(() => {
    if (!quiz) {
      console.log('No quiz data available, redirecting to quiz list...');
      router.replace('/screens/quiz/QuizListScreen');
    }
  }, [quiz, router]);

  // Early return if no quiz data
  if (!quiz) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Loading results...</Text>
      </View>
    );
  }

  const isPassed = score >= quiz.passingScore;
  const bestScore = getBestScore(quiz.id);
  const averageScore = getAverageScore(quiz.id);
  const totalAttempts = getTotalAttempts(quiz.id);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return 'Tahniah! 🎉';
    if (score >= 80) return 'Cemerlang! 👏';
    if (score >= 70) return 'Usaha Baik! 👍';
    if (score >= 60) return 'Teruskan Usaha! 💪';
    return 'Jangan Putus Asa! 📚';
  };

  // Get appropriate Lottie animation based on score
  const getLottieAnimation = (score: number) => {
    if (score >= 90) {
      return require('../../../../assets/animation/celebrate.json');
    } else if (score >= 70) {
      return require('../../../../assets/animation/good-job.json');
    } else {
      return require('../../../../assets/animation/try-again.json');
    }
  };

  const renderLottieWithScore = () => (
    <View className="items-center mb-6">
      {/* Lottie Animation */}
      <View className="w-44 h-44 mb-2">
        <LottieView
          source={getLottieAnimation(score)}
          autoPlay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      
      {/* Score Section */}
      <View className="items-center mb-6">
        <Text className="text-lg text-gray-500 mb-2">Markah Anda</Text>
        <Text className="text-5xl font-bold text-gray-900 mb-3">{score}%</Text>
        
        {/* Status Badge */}
        <View className={`px-6 py-2 rounded-full mb-4 ${isPassed ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text className={`text-sm font-bold tracking-wider ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
            {isPassed ? 'LULUS' : 'GAGAL'}
          </Text>
        </View>
        
        {/* Performance Message */}
        <Text className="text-lg font-semibold text-gray-900 text-center">
          {getPerformanceMessage(score)}
        </Text>
      </View>
    </View>
  );

  const renderStats = () => (
    <View className="mb-8">
      <Text className="text-xl font-bold text-gray-900 mb-6">Kemajuan Anda</Text>
      <View className="flex-row justify-between">
        <View className="flex-1 bg-white p-6 rounded-2xl items-center mx-2 shadow-sm border border-gray-100">
          <View className="w-12 h-12 bg-amber-100 rounded-full items-center justify-center mb-3">
            <Ionicons name="trophy" size={24} color="#F59E0B" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-1">{bestScore}%</Text>
          <Text className="text-sm text-gray-500 text-center">Markah Terbaik</Text>
        </View>
        
        <View className="flex-1 bg-white p-6 rounded-2xl items-center mx-2 shadow-sm border border-gray-100">
          <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-3">
            <Ionicons name="trending-up" size={24} color="#8B5CF6" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-1">{averageScore}%</Text>
          <Text className="text-sm text-gray-500 text-center">Purata Markah</Text>
        </View>
        
        <View className="flex-1 bg-white p-6 rounded-2xl items-center mx-2 shadow-sm border border-gray-100">
          <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center mb-3">
            <Ionicons name="refresh" size={24} color="#06B6D4" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-1">{totalAttempts}</Text>
          <Text className="text-sm text-gray-500 text-center">Bilangan Cubaan</Text>
        </View>
      </View>
    </View>
  );

  const renderSummary = () => (
    <View className="mb-8">
      <Text className="text-xl font-bold text-gray-900 mb-6">Ringkasan Cubaan</Text>
      <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
          <Text className="text-base text-gray-600">Jawapan Betul:</Text>
          <Text className="text-base font-bold text-gray-900">
            {userAnswers.filter((answer, index) => 
              answer === quiz.questions[index]?.correctAnswer
            ).length} / {quiz.questions.length}
          </Text>
        </View>
        <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
          <Text className="text-base text-gray-600">Markah Lulus:</Text>
          <Text className="text-base font-bold text-gray-900">{quiz.passingScore}%</Text>
        </View>
        <View className="flex-row justify-between items-center py-3">
          <Text className="text-base text-gray-600">Had Masa:</Text>
          <Text className="text-base font-bold text-gray-900">{quiz.timeLimit} minit</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          headerTitle: "Keputusan Kuiz", 
          headerShadowVisible: false,
          headerBackTitle: '',
          headerLeft: () => BackButton()
        }}
      /> 
      <View className="p-5">
        {/* Lottie Animation with Score */}
        {renderLottieWithScore()}
        
        {/* Stats */}
        {renderStats()}

        {/* Summary */}
        {renderSummary()}

        {/* Home Button */}
        <TouchableOpacity
          className="bg-emerald-500 py-5 rounded-2xl items-center shadow-sm active:bg-emerald-600"
          onPress={() => router.push('/screens/quiz/QuizListScreen')}
        >
          <Text className="text-white font-semibold text-lg">Kembali ke Senarai Kuiz</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default QuizResults;
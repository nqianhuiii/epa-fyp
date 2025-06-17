// screens/quiz/QuizResults.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuizStore } from '../../../store/quizStore';
import { Quiz } from '../../../types/QuizType';

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

  // Parse params if coming from navigation
  const quiz: Quiz = currentQuiz || JSON.parse(params.quiz as string);
  const userAnswers: number[] = currentAnswers || JSON.parse(params.userAnswers as string);
  const score: number = currentScore || parseInt(params.score as string);

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
    if (score >= 90) return 'Excellent work! 🎉';
    if (score >= 80) return 'Great job! 👏';
    if (score >= 70) return 'Good effort! 👍';
    if (score >= 60) return 'Keep practicing! 💪';
    return 'Don\'t give up! 📚';
  };

  const handleRetakeQuiz = () => {
    Alert.alert(
      'Retake Quiz',
      'Are you sure you want to retake this quiz?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Retake',
          onPress: () => {
            clearCurrentQuiz();
            router.push({
              pathname: '/screens/quiz/taking/[id]',
              params: { id: quiz.id, quiz: JSON.stringify(quiz)}
          })
        }}
      ]
    );
  };

//   const handleViewAnswers = () => {
//     router.push({
//       pathname: '/screens/quiz/review',
//       params: {
//         quiz: JSON.stringify(quiz),
//         userAnswers: JSON.stringify(userAnswers)
//       }
//     });
//   };

  const renderScoreCircle = () => (
    <View className="items-center mb-8">
      <LinearGradient
        colors={score >= quiz.passingScore ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
        className="w-36 h-36 rounded-full justify-center items-center shadow-lg"
      >
        <Text className="text-4xl font-bold text-white">{score}%</Text>
        <Text className="text-sm text-white opacity-90">Score</Text>
      </LinearGradient>
    </View>
  );

  const renderQuestionResults = () => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-4">Question Breakdown</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row px-1">
          {quiz.questions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.correctAnswer;
            const wasAnswered = userAnswers[index] !== -1;
            
            let bgColor = 'bg-gray-400'; // Not answered
            if (wasAnswered) {
              bgColor = isCorrect ? 'bg-green-500' : 'bg-red-500';
            }
            
            return (
              <View
                key={question.id}
                className={`w-10 h-10 rounded-full justify-center items-center mr-2 ${bgColor}`}
              >
                <Text className="text-white font-semibold text-sm">{index + 1}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  const renderStats = () => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-4">Your Progress</Text>
      <View className="flex-row justify-between">
        <View className="flex-1 bg-white p-5 rounded-xl items-center mx-1 shadow-sm">
          <Ionicons name="trophy" size={24} color="#F59E0B" />
          <Text className="text-2xl font-bold text-gray-900 mt-2">{bestScore}%</Text>
          <Text className="text-xs text-gray-500 mt-1">Best Score</Text>
        </View>
        <View className="flex-1 bg-white p-5 rounded-xl items-center mx-1 shadow-sm">
          <Ionicons name="trending-up" size={24} color="#8B5CF6" />
          <Text className="text-2xl font-bold text-gray-900 mt-2">{averageScore}%</Text>
          <Text className="text-xs text-gray-500 mt-1">Average</Text>
        </View>
        <View className="flex-1 bg-white p-5 rounded-xl items-center mx-1 shadow-sm">
          <Ionicons name="refresh" size={24} color="#06B6D4" />
          <Text className="text-2xl font-bold text-gray-900 mt-2">{totalAttempts}</Text>
          <Text className="text-xs text-gray-500 mt-1">Attempts</Text>
        </View>
      </View>
    </View>
  );

  const renderSummary = () => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-4">Summary</Text>
      <View className="bg-white p-5 rounded-xl shadow-sm">
        <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
          <Text className="text-sm text-gray-500">Correct Answers:</Text>
          <Text className="text-sm font-semibold text-gray-900">
            {userAnswers.filter((answer, index) => 
              answer === quiz.questions[index].correctAnswer
            ).length} / {quiz.questions.length}
          </Text>
        </View>
        <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
          <Text className="text-sm text-gray-500">Passing Score:</Text>
          <Text className="text-sm font-semibold text-gray-900">{quiz.passingScore}%</Text>
        </View>
        <View className="flex-row justify-between items-center py-2">
          <Text className="text-sm text-gray-500">Time Limit:</Text>
          <Text className="text-sm font-semibold text-gray-900">{quiz.timeLimit} minutes</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-center px-5 pt-14 pb-5 bg-white border-b border-gray-200">
        <TouchableOpacity
          className="absolute left-5 top-14 p-2"
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Quiz Results</Text>
      </View>

      <View className="p-5">
        {/* Score Display */}
        {renderScoreCircle()}
        
        {/* Performance Message */}
        <View className="items-center mb-8">
          <Text className={`text-base font-bold tracking-wider mb-2 ${getScoreColor(score)}`}>
            {isPassed ? 'PASSED' : 'FAILED'}
          </Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2">
            {getPerformanceMessage(score)}
          </Text>
          <Text className="text-base text-gray-500 text-center">{quiz.title}</Text>
        </View>

        {/* Question Results */}
        {renderQuestionResults()}

        {/* Stats */}
        {renderStats()}

        {/* Summary */}
        {renderSummary()}

        {/* Action Buttons */}
        <View className="flex-row mb-5">
            <Ionicons name="eye" size={20} color="#6366F1" />
            <Text className="text-indigo-500 font-semibold ml-2">Review Answers</Text>
          
          
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-3 bg-indigo-500 rounded-lg mx-1"
            onPress={handleRetakeQuiz}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Retake Quiz</Text>
          </TouchableOpacity>
        </View>

        {/* Home Button */}
        <TouchableOpacity
          className="bg-white py-4 rounded-lg items-center border border-gray-200"
          onPress={() => router.push('./screens/QuizListScreen')}
        >
          <Text className="text-gray-500 font-medium">Back to Quiz List</Text>
        </TouchableOpacity>
        </View>
    </ScrollView>
  );
};

export default QuizResults;
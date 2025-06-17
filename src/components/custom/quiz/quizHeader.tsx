// components/quiz/QuizHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface QuizHeaderProps {
  onExit: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemaining?: number;
  timeLimit?: number;
  formatTime: (seconds: number) => string;
  quizTitle?: string; // Add quiz title prop
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  onExit,
  currentQuestionIndex,
  totalQuestions,
  timeRemaining,
  timeLimit,
  formatTime,
  quizTitle = "Kuiz"
}) => {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <View className="bg-white">
      {/* Top navigation bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onExit} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#4ade80" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">{quizTitle}</Text>
        </View>
        
        {(timeLimit || 0) > 0 && timeRemaining !== undefined && (
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text className="text-sm font-medium text-gray-600 ml-1">
              {formatTime(timeRemaining)}
            </Text>
          </View>
        )}
      </View>

      {/* Progress section */}
      <View className="px-4 py-3 bg-white">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-medium text-gray-700">
            Soalan {currentQuestionIndex + 1} daripada {totalQuestions}
          </Text>
          <Text className="text-sm text-gray-500">
            {Math.round(progressPercentage)}%
          </Text>
        </View>
        
        {/* Progress bar */}
        <View className="w-full bg-gray-200 rounded-full h-2">
          <View 
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
      </View>
    </View>
  );
};
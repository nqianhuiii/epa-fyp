// components/quiz/QuestionScreen.tsx
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { QuizQuestion } from '../../../types/QuizType';
import { QuizHeader } from './quizHeader';
import { AnswerOption } from './answerOption';
import { Stack } from 'expo-router';

interface QuestionScreenProps {
  question: QuizQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  timeRemaining: number;
  timeLimit: number;
  formatTime: (seconds: number) => string;
  onAnswerSelect: (index: number) => void;
  onConfirmAnswer: () => void;
  onExit: () => void;
  quizTitle?: string; // Add quiz title prop
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  timeRemaining,
  timeLimit,
  formatTime,
  onAnswerSelect,
  onConfirmAnswer,
  onExit,
  quizTitle = "Kuiz"
}) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{
        headerShown: false,
      }} />
      
      <QuizHeader
        onExit={onExit}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        timeRemaining={timeRemaining}
        timeLimit={timeLimit}
        formatTime={formatTime}
        quizTitle={quizTitle}
      />

      {/* Question Content */}
      <View className="flex-1 p-4">
        {/* Question Card - Updated styling */}
        <View className="bg-white rounded-2xl p-8 mb-6 shadow-md mx-2">
            <Text className="text-xl font-bold text-gray-900 leading-7 text-center">
                {question.question}
            </Text>
        </View>

        {/* Answer Options */}
        <View className="space-y-3">
          {question.options?.map((option, index) => (
            <AnswerOption
              key={index}
              option={option}
              index={index}
              isSelected={selectedAnswer === index}
              onSelect={onAnswerSelect}
            />
          ))}
        </View>
      </View>

      {/* Confirm Button */}
      <View className="p-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          onPress={onConfirmAnswer}
          disabled={selectedAnswer === null}
          className={`py-3 px-6 rounded-lg ${
            selectedAnswer !== null
              ? 'bg-emerald-400'
              : 'bg-gray-300'
          }`}
        >
          <Text className={`text-center font-semibold ${
            selectedAnswer !== null ? 'text-white' : 'text-gray-500'
          }`}>
            Sahkan Jawapan
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
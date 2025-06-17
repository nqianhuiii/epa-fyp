import React, { useEffect, useRef } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { QuizQuestion } from '../../../types/QuizType';
import { AnswerOption } from './answerOption';
import { QuizHeader } from './quizHeader';

interface AnswerRevealScreenProps {
  question: QuizQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  isCorrect: boolean;
  onNextQuestion: () => void;
  timeRemaining: number;
  timeLimit: number;
  formatTime: (seconds: number) => string;
  onExit: () => void;
  quizTitle?: string; // Add quiz title prop
}

export const AnswerRevealScreen: React.FC<AnswerRevealScreenProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  isCorrect,
  onNextQuestion, 
  timeRemaining,
  timeLimit,
  formatTime,
  onExit,
  quizTitle = "Kuiz"
}) => {
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    // Trigger confetti when answer is correct
    if (isCorrect && confettiRef.current) {
      confettiRef.current.start();
    }
  }, [isCorrect]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
        <QuizHeader
            onExit={onExit}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            timeRemaining={timeRemaining}
            timeLimit={timeLimit}
            formatTime={formatTime}
            quizTitle={quizTitle}
        />

      <View className="p-4">
        {/* Question */}
        <View className="bg-white rounded-2xl p-8 mb-6 shadow-md mx-2">
            <Text className="text-xl font-bold text-gray-900 leading-7 text-center">
                {question.question}
            </Text>
        </View>

        {/* Answer Options with Results */}
        <View className="space-y-3 mb-4">
          {question.options?.map((option, index) => (
            <AnswerOption
              key={index}
              option={option}
              index={index}
              isSelected={false}
              isCorrect={index === question.correctAnswer}
              isUserAnswer={selectedAnswer === index}
              showResult={true}
            />
          ))}
        </View>

        {/* Explanation */}
        {question.explanation && (
          <View className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-4 mb-4">
            <View className="flex-row items-start">
            <Text className=" font-medium mb-1">💡</Text>
              <View className="flex-1 ml-2">
                <Text className="text-blue-800 font-medium mb-1">Penjelasan:</Text>
                <Text className="text-blue-800 text-sm semi-bold leading-5">
                  {question.explanation}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Next Button */}
      <View className="p-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          onPress={onNextQuestion}
          className="bg-blue-500 py-3 px-6 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            {currentQuestionIndex < totalQuestions - 1 ? 'Soalan Seterusnya' : 'Selesai Kuiz'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Confetti Animation - only shows when correct */}
      {isCorrect && (
        <ConfettiCannon
          ref={confettiRef}
          count={50}
          origin={{ x: -10, y: 0 }}
          explosionSpeed={350}
          fallSpeed={2500}
          colors={['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C']}
          fadeOut={true}
          autoStart={false}
        />
      )}
    </SafeAreaView>
  );
};

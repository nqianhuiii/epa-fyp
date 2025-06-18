// components/QuizCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../../ui/card';
import { QuizCardProps } from '../../../types/QuizType';

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onPress }) => {
  const getDifficultyInfo = (questionCount: number) => {
    if (questionCount <= 5) return { label: 'Pantas', color: 'bg-emerald-100 text-emerald-700' };
    if (questionCount <= 10) return { label: 'Sederhana', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Mencabar', color: 'bg-red-100 text-red-700' };
  };

  const difficulty = getDifficultyInfo(quiz.questions.length);

  return (
    <TouchableOpacity onPress={() => onPress(quiz)} activeOpacity={0.7}>
      <Card className="mb-4 mx-4 bg-white border-t-8 border-blue-500 rounded-xl shadow-sm">
        {/* Emerald Top Border */}
        
        <View className="p-4">
          {/* Header with Title and Difficulty Badge */}
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-3">
              <Text className="text-lg font-semibold text-gray-800 mb-1" numberOfLines={2}>
                {quiz.title}
              </Text>
              <View className="flex-row items-center">
                <View className={`px-2 py-1 rounded-full ${difficulty.color}`}>
                  <Text className="text-xs font-medium">
                    {difficulty.label}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          {quiz.description && (
            <Text className="text-sm text-gray-600 leading-5 mb-3" numberOfLines={3}>
              {quiz.description}
            </Text>
          )}

          {/* Quiz Stats - Close positioning */}
          <View className="flex-row items-center mb-3">
            <View className="flex-row items-center mr-6">
              <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1.5">
                {quiz.questions.length} soalan
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1.5">
                {quiz.timeLimit} minit
              </Text>
            </View>
          </View>
          
          {/* Passing Score - Orange highlight with icon badge */}
          <View className="bg-orange-50 border border-orange-400 rounded-xl p-3 mb-3">
            <View className="flex-row items-center">
              <View className="bg-orange-100 w-8 h-8 rounded-full items-center justify-center mr-3">
                <Ionicons name="trophy" size={16} color="#EA580C" />
              </View>
              <View className="flex-1">
                <Text className="text-orange-800 font-semibold text-sm">
                  Markah Lulus
                </Text>
                <Text className="text-orange-700 text-xs">
                  Perlu mencapai {quiz.passingScore}% untuk berjaya
                </Text>
              </View>
            </View>
          </View>

          {/* Start Quiz Button */}
          <TouchableOpacity
            className="bg-emerald-500 flex-row items-center justify-center py-2.5 px-4 rounded-xl"
            onPress={() => onPress(quiz)}
          >
            <Ionicons name="play" size={16} color="white" />
            <Text className="text-white text-sm font-medium ml-2">Mula Kuiz</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
};


export default QuizCard;